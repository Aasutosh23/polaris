import { generateText } from "ai";
import { inngest } from "./client";
import { gptOss } from "@/lib/ai";
import { firecrawl } from "@/lib/firecrawl";

const URL_REGEX = "/https?:\/\/[^\s]+/g";

export const demoGenerate = inngest.createFunction(
  {
    id: "demo-generate",
    retries: 2,
    triggers: [{ event: "demo/generate" }],
  },
  async ({ event, step }) => {
    const { prompt } = event.data as { prompt: string };

    const urls = (await step.run("exctract-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];
    })) as string[];

    const scrapeContent = await step.run("scrape-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(url, { formats: ["markdown"] });
          return result.markdown ?? null;
        }),
      );
      return results.filter(Boolean).join("\n\n");
    });

    const finalPrompt = scrapeContent
      ? `Context:\n${scrapeContent}\n\nQuestion: ${prompt}`
      : prompt;

    const result = await step.run("generate-text", async () => {
      return await generateText({
        model: gptOss,
        prompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      });
    });

    return result;
  },
);

export const demoError = inngest.createFunction(
  {
    id: "demo-error",
    triggers: {
      event: "demo/error",
    },
  },
  async ({ step }) => {
    await step.run("fail", async () => {
      throw new Error("Inngest error: Background job failed!");
    });
  },
);
