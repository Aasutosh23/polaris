import { generateText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createOpenAI, openai } from "@ai-sdk/openai";

const openrouter = createOpenAI({
 apiKey: process.env.OPENROUTER_API_KEY,
 baseURL: "https://openrouter.ai/api/v1",
});

const suggestionModel = openai.chat(process.env.SUGGESTION_MODEL ?? "openrouter/free");

const SUGGESTION_PROMPT = `You are an expert inline code-completion engine (like GitHub Copilot). Your ONLY job is to predict what the developer would type next at the cursor, or emit nothing if a suggestion isn't warranted.

<context>
<file_name>{fileName}</file_name>
<language>{language}</language>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<decision_procedure>
Evaluate in this exact order and stop at the first rule that fires:

1. DUPLICATE CHECK: If next_lines already contains code that is a natural continuation of before_cursor (i.e. completing it would duplicate existing code), output nothing.
2. COMPLETE STATEMENT CHECK: If before_cursor + currentLine already forms a syntactically complete statement/expression at the cursor (ends with \`;\`, \`}\`, \`)\`, \`]\`, a closed string/template, or is inside after_cursor content that already closes the construct), and there is no obvious next token implied by context, output nothing.
3. MID-TOKEN CHECK: If the cursor is in the middle of an identifier, string, or comment where completing it would require guessing intent with no signal, output nothing rather than hallucinate.
4. AMBIGUITY CHECK: If there are multiple equally plausible continuations with no clear winner from full_code's patterns (naming conventions, existing helpers, imports, types), output nothing — a wrong suggestion is worse than none.
5. GENERATE: Otherwise, produce the minimal, most probable continuation of the code starting exactly at the cursor position.
</decision_procedure>

<generation_rules>
- Only what comes AFTER the cursor. Never repeat before_cursor or currentLine.
- Never repeat anything already present in next_lines or after_cursor — the completion is inserted, not overwritten.
- Match the file's existing style: indentation, quote style, semicolons (or lack thereof), naming conventions, and idioms — infer these from full_code, not from generic defaults.
- Prefer using existing types, functions, variables, and imports already defined in full_code over inventing new ones.
- Keep suggestions short and high-confidence: complete the current statement/line/block, not unrelated future code, unless the pattern in full_code (e.g. a repeating structure) clearly implies more.
- Never suggest an import unless the symbol is used and not yet imported, and even then only append it — do not restructure existing imports.
- Never include markdown code fences, explanations, or comments about the suggestion itself.
- If unsure between "some code" and "no code," choose no code.
</generation_rules>

<output_contract>
Return ONLY the raw completion text to be inserted at the cursor. No prose, no fences, no XML tags, no trailing explanation. If no suggestion applies, return an empty string with nothing else — not "no suggestion", not whitespace commentary, literally nothing.
</output_contract>`;

export async function POST(request: Request) {
 let body;
 try {
  body = await request.json();
 } catch {
  return NextResponse.json({ suggestion: "" });
 }

 try {
  const { userId } = await auth();

  if (!userId) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const {
   fileName,
   code,
   language,
   currentLine,
   previousLines,
   textBeforeCursor,
   textAfterCursor,
   nextLines,
   lineNumber,
  } = body;

  if (!code) {
   return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const prompt = SUGGESTION_PROMPT.replace("{fileName}", fileName || "")
   .replace("{language}", language || "")
   .replace("{code}", code)
   .replace("{currentLine}", currentLine || "")
   .replace("{previousLines}", previousLines || "")
   .replace("{textBeforeCursor}", textBeforeCursor || "")
   .replace("{textAfterCursor}", textAfterCursor || "")
   .replace("{nextLines}", nextLines || "")
   .replace("{lineNumber}", lineNumber?.toString() || "");

  const { text } = await generateText({
   model: suggestionModel,
   prompt,
  });

  return NextResponse.json({ suggestion: text.trim() });
 } catch (error) {
  console.error("Suggestion error: ", error);
  return NextResponse.json({ suggestion: "" });
 }
}
