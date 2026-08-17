import { generateText } from "ai";
import { inngest } from "./client";
import { gptOss } from "@/lib/ai";

export const demoGenerate = inngest.createFunction(
  {
    id: "demo-generate",
    triggers: [{ event: "demo/generate" }],
    retries: 2,
  },
  async ({ step }) => {
    const result = await step.run("generate-text", async () => {
      return await generateText({
        model: gptOss,
        prompt: "Write a vegetarian lasagna recipe for 4 people",
      });
    });

    return result;
  },
);
