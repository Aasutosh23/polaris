import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { Id } from "../../../../../convex/_generated/dataModel";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../../convex/_generated/api";

interface ListFilesToolOptions {
 projectId: Id<"projects">;
 internalKey: string;
}

export const createListFilesTool = ({ projectId, internalKey }: ListFilesToolOptions) => {
 return createTool({
  name: "listFiles",
  description:
   "List all files and folders in the project. Returns the ID, name, type, and parentId of each item. Always use the returned ID when calling other file tools.",
  parameters: z.object({}),
  handler: async (_, { step: toolStep }) => {
   try {
    return await toolStep?.run("list-files", async () => {
     const files = await convex.query(api.system.getProjectFiles, {
      internalKey,
      projectId,
     });

     const sorted = files.sort((a, b) => {
      if (a.type !== b.type) {
       return a.type === "folder" ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
     });

     const fileList = sorted.map((f) => ({
      id: f._id,
      name: f.name,
      type: f.type,
      parentId: f.parentId ?? null,
     }));

     return JSON.stringify(fileList);
    });
   } catch (error) {
    return `Error listing files: ${error instanceof Error ? error.message : "Unknown error"}`;
   }
  },
 });
};
