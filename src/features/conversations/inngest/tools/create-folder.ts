import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { loadProjectFiles, resolveParent } from "./resolve-file";

interface CreateFolderToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

const paramsSchema = z.object({
 name: z.string().min(1, "Folder name is required"),
 parentId: z.string(),
});

export const createCreateFolderTool = ({ projectId, internalKey }: CreateFolderToolOptions) => {
 return createTool({
  name: "createFolder",
  description: "Create a new folder in the project. The name must be a plain name with no '/'.",
  parameters: z.object({
   name: z.string().describe("The plain name of the folder to create, e.g. 'src'"),
   parentId: z
    .string()
    .describe("The ID of the parent folder from listFiles, or empty string for root level"),
  }),
  handler: async (params, { step: toolStep }) => {
   const parsed = paramsSchema.safeParse(params);

   if (!parsed.success) {
    return `Error: ${parsed.error.issues[0].message}`;
   }

   const { name, parentId } = parsed.data;

   if (name.includes("/")) {
    return `Error: Folder name must not contain "/". Create nested folders one level at a time.`;
   }

   try {
    return await toolStep?.run("create-folder", async () => {
     const existing = await loadProjectFiles(internalKey, projectId);
     const parent = resolveParent(existing, parentId);

     if (!parent.ok) return `Error: ${parent.error}`;

     const folderId = await convex.mutation(api.system.createFolder, {
      internalKey,
      projectId,
      name,
      parentId: parent.parentId,
     });

     return `Folder created with ID: ${folderId}`;
    });
   } catch (error) {
    return `Error creating folder: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
