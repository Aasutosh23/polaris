import { generateText } from "ai";
import { gptOss } from "@/lib/ai";

export async function POST() {
  try {
    const response = await generateText({
      model: gptOss,
      prompt: "Write a vegetarian lasagna recipe for 4 people",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return Response.json({ response });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "The model is temporarily busy. Please try again." },
      { status: 503 },
    );
  }
}
