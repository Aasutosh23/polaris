import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { findFile, loadProjectFiles } from "./resolve-file";

interface RenameFileToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

const paramsSchema = z.object({
 fileId: z.string().min(1, "File ID is required"),
 newName: z.string().min(1, "New name is required"),
});

export const createRenameFileTool = ({ projectId, internalKey }: RenameFileToolOptions) => {
 return createTool({
  name: "renameFile",
  description:
   "Rename a file or folder. Pass its ID from listFiles (preferred) or its full path. newName must be a plain name with no '/'.",
  parameters: z.object({
   fileId: z.string().describe("The ID (preferred) or full path of the file or folder"),
   newName: z.string().describe("The new plain name, e.g. 'App.tsx'"),
  }),
  handler: async (params, { step: toolStep }) => {
   const parsed = paramsSchema.safeParse(params);
   if (!parsed.success) {
    return `Error: ${parsed.error.issues[0].message}`;
   }

   const { fileId, newName } = parsed.data;

   if (newName.includes("/")) {
    return `Error: newName must not contain "/". Use a plain name.`;
   }

   try {
    return await toolStep?.run("rename-file", async () => {
     const files = await loadProjectFiles(internalKey, projectId);
     const found = findFile(files, fileId);

     if (!found.ok) return `Error: ${found.error}`;

     await convex.mutation(api.system.renameFile, {
      internalKey,
      fileId: found.file._id,
      newName,
     });

     return `Renamed "${found.file.name}" to "${newName}" successfully`;
    });
   } catch (error) {
    return `Error renaming file: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
