import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { findFile, loadProjectFiles } from "./resolve-file";

interface DeleteFilesToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

const paramsSchema = z.object({
 fileIds: z
  .array(z.string().min(1, "File ID cannot be empty"))
  .min(1, "Provide at least one file ID"),
});

export const createDeleteFilesTool = ({ projectId, internalKey }: DeleteFilesToolOptions) => {
 return createTool({
  name: "deleteFiles",
  description:
   "Delete files or folders from the project. Pass IDs from listFiles (preferred) or full paths. Deleting a folder deletes all its contents recursively.",
  parameters: z.object({
   fileIds: z.array(z.string()).describe("File or folder IDs (preferred) or full paths to delete"),
  }),
  handler: async (params, { step: toolStep }) => {
   const parsed = paramsSchema.safeParse(params);
   if (!parsed.success) {
    return `Error: ${parsed.error.issues[0].message}`;
   }

   const { fileIds } = parsed.data;

   try {
    return await toolStep?.run("delete-files", async () => {
     const files = await loadProjectFiles(internalKey, projectId);

     const toDelete: { id: Id<"files">; name: string; type: string }[] = [];

     for (const ref of fileIds) {
      const found = findFile(files, ref);
      if (!found.ok) return `Error: ${found.error}`;

      toDelete.push({ id: found.file._id, name: found.file.name, type: found.file.type });
     }

     const results: string[] = [];

     for (const file of toDelete) {
      try {
       await convex.mutation(api.system.deleteFile, { internalKey, fileId: file.id });
       results.push(`Deleted ${file.type} "${file.name}" successfully`);
      } catch {
       // Already removed, e.g. its parent folder was deleted first
       results.push(`${file.type} "${file.name}" was already deleted`);
      }
     }

     return results.join("\n");
    });
   } catch (error) {
    return `Error deleting files: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
