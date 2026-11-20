import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { Id } from "../../../../../convex/_generated/dataModel";
import { findFile, loadProjectFiles } from "./resolve-file";

interface ReadFilesToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

const paramsSchema = z.object({
 fileIds: z.array(z.string().min(1, "File ID cannot be empty")).min(1, "Provide at least one file"),
});

export const createReadFilesTool = ({ projectId, internalKey }: ReadFilesToolOptions) => {
 return createTool({
  name: "readFiles",
  description:
   "Read the content of files from the project. Pass the file IDs returned by listFiles (preferred). A full path like 'src/main.tsx' also works.",
  parameters: z.object({
   fileIds: z
    .array(z.string())
    .describe("File IDs from listFiles (preferred), or full file paths like 'src/main.tsx'"),
  }),
  handler: async (params, { step: toolStep }) => {
   const parsed = paramsSchema.safeParse(params);
   if (!parsed.success) {
    return `Error: ${parsed.error.issues[0].message}`;
   }

   const { fileIds } = parsed.data;

   try {
    return await toolStep?.run("read-files", async () => {
     const files = await loadProjectFiles(internalKey, projectId);

     const results: { id: string; name: string; content: string }[] = [];
     const errors: string[] = [];

     for (const ref of fileIds) {
      const found = findFile(files, ref);

      if (!found.ok) {
       errors.push(found.error);
       continue;
      }

      if (found.file.type === "folder") {
       errors.push(`"${ref}" is a folder, not a file`);
       continue;
      }

      if (found.file.storageId) {
       errors.push(`"${ref}" is a binary file and cannot be read as text`);
       continue;
      }

      results.push({
       id: found.file._id,
       name: found.file.name,
       content: found.file.content ?? "",
      });
     }

     if (results.length === 0) {
      return `Error: ${errors.join("; ") || "No files found"}`;
     }

     return JSON.stringify({ files: results, errors });
    });
   } catch (error) {
    return `Error reading files: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
