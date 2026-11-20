import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { loadProjectFiles, resolveParent } from "./resolve-file";

interface CreateFilesToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

const paramsSchema = z.object({
 parentId: z.string(),
 files: z
  .array(z.object({ name: z.string().min(1, "File name cannot be empty"), content: z.string() }))
  .min(1, "Provide at least one file to create"),
});

export const createCreateFilesTool = ({ projectId, internalKey }: CreateFilesToolOptions) => {
 return createTool({
  name: "createFiles",
  description:
   "Create multiple files at once in the same folder. More efficient than creating files one by one. File names must be plain names with no '/'.",
  parameters: z.object({
   parentId: z
    .string()
    .describe(
     "The ID of the parent folder from listFiles or createFolder. Use empty string for root level."
    ),
   files: z
    .array(
     z.object({
      name: z.string().describe("The plain file name including extension, e.g. 'App.tsx'"),
      content: z.string().describe("The file content"),
     })
    )
    .describe("Array of files to create"),
  }),
  handler: async (params, { step: toolStep }) => {
   const parsed = paramsSchema.safeParse(params);

   if (!parsed.success) {
    return `Error: ${parsed.error.issues[0].message}`;
   }

   const { parentId, files } = parsed.data;

   const badName = files.find((f) => f.name.includes("/"));
   if (badName) {
    return `Error: "${badName.name}" contains "/". Create the folder first, then create the file inside it using the folder's ID as parentId.`;
   }

   try {
    return await toolStep?.run("create-files", async () => {
     const existing = await loadProjectFiles(internalKey, projectId);
     const parent = resolveParent(existing, parentId);

     if (!parent.ok) return `Error: ${parent.error}`;

     const results = await convex.mutation(api.system.createFiles, {
      internalKey,
      projectId,
      parentId: parent.parentId,
      files,
     });

     const created = results.filter((r) => !r.error);
     const failed = results.filter((r) => r.error);

     let response = `Created ${created.length} file(s)`;
     if (created.length > 0) {
      response += `: ${created.map((r) => r.name).join(", ")}`;
     }
     if (failed.length > 0) {
      response += `. Failed: ${failed.map((r) => `${r.name} (${r.error})`).join(", ")}`;
     }

     return response;
    });
   } catch (error) {
    return `Error creating files: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
