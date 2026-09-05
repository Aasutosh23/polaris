import { generateText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createOpenAI } from "@ai-sdk/openai";

import { firecrawl } from "@/lib/firecrawl";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const suggestionModel = openrouter("minimax/minimax-m2.7:free");

const URL_REGEX = /https?:\/\/[^\s\]>]+/g;

const QUICK_EDIT_PROMPT = `You are a precise, surgical code-editing assistant operating inside an IDE. You edit ONLY the selected code according to the user's instruction, using the surrounding file purely as context — never as something to modify.

<context>
<file_name>{fileName}</file_name>
<language>{language}</language>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>
{documentation}
<instruction>
{instruction}
</instruction>

<rules>
1. SCOPE: Edit ONLY the selected_code block. Never modify, reference edits to, or output code outside that selection — full_code_context is read-only reference for types, naming conventions, imports, and surrounding logic.
2. FIDELITY: Preserve the original indentation level, brace/quote style, and formatting conventions of selected_code exactly, unless the instruction explicitly asks to change formatting.
3. MINIMAL DIFF: Change only what the instruction requires. Do not refactor, rename, reformat, "improve," or add unrelated functionality beyond the instruction, even if you notice possible improvements.
4. CORRECTNESS: The edited code must remain syntactically valid on its own when re-inserted into its original location (balanced brackets/quotes relative to what was selected; do not introduce dangling braces or unclosed constructs).
5. CONSISTENCY: If the instruction requires new identifiers (variables, functions, types), name them consistently with conventions observed in full_code_context.
6. AMBIGUOUS OR INVALID INSTRUCTIONS: If the instruction is unclear, contradictory, not applicable to the selected code, or would require changes outside the selection to work correctly, return selected_code completely unchanged — do not guess or partially apply it.
7. NO COMMENTARY: Do not add comments, docstrings, logging, or explanations unless the instruction explicitly requests them.
8. NO META-TEXT: Never acknowledge the instruction, describe what you changed, wrap output in markdown fences, or add any text before/after the code.
</rules>

<output_contract>
Return ONLY the raw edited code that replaces selected_code — nothing else. No fences, no XML tags, no explanation, no diff markup. Output must be a drop-in replacement for the original selection.
</output_contract>`;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedCode, fullCode, instruction, fileName, language } =
      await request.json();

    if (!selectedCode) {
      return NextResponse.json(
        { error: "Selected code is required" },
        { status: 400 },
      );
    }

    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 },
      );
    }

    const urls: string[] = instruction.match(URL_REGEX) || [];
    let documentationContext = "";

    if (urls.length > 0) {
      const scrapeResults = await Promise.all(
        urls.map(async (url) => {
          try {
            const result = await firecrawl.scrape(url, {
              formats: ["markdown"],
            });

            if (result.markdown) {
              return `<doc url="${url}">\n${result.markdown}\n</doc>`;
            }

            return null;
          } catch (error) {
            return null;
          }
        }),
      );

      const validResults = scrapeResults.filter(Boolean);

      if (validResults.length > 0) {
        documentationContext = `<documentation>\n${validResults.join("\n\n")}\n</documentation>`;
      }
    }

    const prompt = QUICK_EDIT_PROMPT.replace(
      "{fileName}",
      fileName || "untitled",
    )
      .replace("{language}", language || "plaintext")
      .replace("{selectedCode}", selectedCode)
      .replace("{fullCode}", fullCode || "")
      .replace("{instruction}", instruction)
      .replace("{documentation}", documentationContext);

    const { text } = await generateText({
      model: suggestionModel,
      prompt,
    });

    return NextResponse.json({ editedCode: text.trim() });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json(
      { error: "Failed to generate edit" },
      { status: 500 },
    );
  }
}
