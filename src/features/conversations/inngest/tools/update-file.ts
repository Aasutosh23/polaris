import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { findFile, loadProjectFiles } from "./resolve-file";

interface UpdateFileToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

const paramsSchema = z.object({
 fileId: z.string().min(1, "File ID is required"),
 content: z.string(),
});

export const createUpdateFileTool = ({ projectId, internalKey }: UpdateFileToolOptions) => {
 return createTool({
  name: "updateFile",
  description:
   "Update the content of an existing file. Pass the file ID from listFiles (preferred) or the full path like 'src/main.tsx'.",
  parameters: z.object({
   fileId: z.string().describe("The file ID from listFiles (preferred) or its full path"),
   content: z.string().describe("The complete new content for the file"),
  }),
  handler: async (params, { step: toolStep }) => {
   const parsed = paramsSchema.safeParse(params);

   if (!parsed.success) {
    return `Error: ${parsed.error.issues[0].message}`;
   }

   const { fileId, content } = parsed.data;

   try {
    return await toolStep?.run("update-file", async () => {
     const files = await loadProjectFiles(internalKey, projectId);
     const found = findFile(files, fileId);

     if (!found.ok) return `Error: ${found.error}`;

     if (found.file.type === "folder") {
      return `Error: "${fileId}" is a folder, not a file. You can only update file contents`;
     }

     await convex.mutation(api.system.updateFile, {
      internalKey,
      fileId: found.file._id,
      content,
     });

     return `File "${found.file.name}" updated successfully`;
    });
   } catch (error) {
    return `Error updating file: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
