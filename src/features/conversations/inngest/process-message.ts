import { createAgent, createNetwork, openai } from "@inngest/agent-kit";

import { inngest } from "@/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";
import { CODING_AGENT_SYSTEM_PROMPT, TITLE_GENERATOR_SYSTEM_PROMPT } from "./constants";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { createReadFilesTool } from "./tools/read-files";
import { createListFilesTool } from "./tools/list-files";
import { createUpdateFileTool } from "./tools/update-file";
import { createCreateFilesTool } from "./tools/create-files";
import { createCreateFolderTool } from "./tools/create-folder";
import { createRenameFileTool } from "./tools/rename-file";
import { createDeleteFilesTool } from "./tools/delete-files";
import { createScrapeUrlsTool } from "./tools/scrape-urls";

const titleModel = openai({
 model: "openrouter/free",
 apiKey: process.env.OPENROUTER_API_KEY,
 baseUrl: "https://openrouter.ai/api/v1",
});

const codingModel = openai({
 model: "openrouter/free",
 apiKey: process.env.OPENROUTER_API_KEY,
 baseUrl: "https://openrouter.ai/api/v1",
});

interface MessageEvent {
 messageId: Id<"messages">;
 conversationId: Id<"conversations">;
 projectId: Id<"projects">;
 message: string;
}

export const processMessage = inngest.createFunction(
 {
  id: "process-message",
  triggers: { event: "message/sent" },
  cancelOn: [
   {
    event: "message/cancel",
    if: "event.data.messageId == async.data.messageId",
   },
  ],
  onFailure: async ({ event, step }) => {
   const { messageId } = event.data.event.data as MessageEvent;
   const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

   if (internalKey) {
    await step.run("update-message-on-failure", async () => {
     await convex.mutation(api.system.updateMessagesContent, {
      internalKey,
      messageId,
      content:
       "My apologies, I encountered an error while processing your request. Let me know if you need anything else!",
     });
    });
   }
  },
 },
 async ({ event, step }) => {
  const { messageId, conversationId, projectId, message } = event.data as MessageEvent;

  const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
   throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY is not configured");
  }

  await step.sleep("wait-for-db-sync", "1s");

  const conversation = await step.run("get-conversation", async () => {
   return await convex.query(api.system.getConversationById, {
    internalKey,
    conversationId,
   });
  });

  if (!conversation) {
   throw new NonRetriableError("Conversation not found");
  }

  const recentMessages = await step.run("get-recent-messages", async () => {
   return await convex.query(api.system.getRecentMessages, {
    internalKey,
    conversationId,
    limit: 10,
   });
  });

  const contextMessages = recentMessages.filter(
   (msg) => msg._id !== messageId && msg.content.trim() !== ""
  );

  let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

  if (contextMessages.length > 0) {
   const historyText = contextMessages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n\n");

   systemPrompt += `

## Previous Conversation (for context only - do NOT repeat these responses):
${historyText}

## Current Request:
Respond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
  }

  const shouldGenerateTitle = conversation.title === DEFAULT_CONVERSATION_TITLE;

  if (shouldGenerateTitle) {
   const titleAgent = createAgent({
    name: "title-generator",
    system: TITLE_GENERATOR_SYSTEM_PROMPT,
    model: titleModel,
   });

   const { output } = await titleAgent.run(message);

   const textMessage = output.find((item) => item.type === "text" && item.role === "assistant");

   if (textMessage?.type === "text") {
    const title =
     typeof textMessage.content === "string"
      ? textMessage.content.trim()
      : textMessage.content
         .map((content) => content.text)
         .join("")
         .trim();

    if (title) {
     await step.run("update-conversation-title", async () => {
      await convex.mutation(api.system.updateConversationTitle, {
       internalKey,
       conversationId,
       title,
      });
     });
    }
   }
  }

  const codingAgent = createAgent({
   name: "coding-agent",
   description: "An expert AI coding assistant",
   system: systemPrompt,
   model: codingModel,
   tools: [
    createListFilesTool({ projectId, internalKey }),
    createReadFilesTool({ projectId, internalKey }),
    createUpdateFileTool({ projectId, internalKey }),
    createCreateFilesTool({ projectId, internalKey }),
    createCreateFolderTool({ projectId, internalKey }),
    createRenameFileTool({ projectId, internalKey }),
    createDeleteFilesTool({ projectId, internalKey }),
    createScrapeUrlsTool(),
   ],
  });

  const network = createNetwork({
   name: "polaris-network",
   agents: [codingAgent],
   maxIter: 20,
   router: ({ network }) => {
    const lastResult = network.state.results.at(-1);
    const hasTextResponse = lastResult?.output.some(
     (m) => m.type === "text" && m.role === "assistant"
    );

    const hasToolCalls = lastResult?.output.some((m) => m.type === "tool_call");

    if (hasTextResponse && !hasToolCalls) {
     return undefined;
    }
    return codingAgent;
   },
  });

  const result = await network.run(message);

  const lastResult = result.state.results.at(-1);
  const textMessage = lastResult?.output.find((m) => m.type === "text" && m.role === "assistant");

  let assistantResponse = "I processed your request. Let me know if you need anything else!";

  if (textMessage?.type === "text") {
   assistantResponse =
    typeof textMessage.content === "string"
     ? textMessage.content
     : textMessage.content.map((c) => c.text).join("");
  }

  await step.run("update-assistant-message", async () => {
   await convex.mutation(api.system.updateMessagesContent, {
    internalKey,
    messageId,
    content: assistantResponse,
   });
  });

  return { success: true, messageId };
 }
);
