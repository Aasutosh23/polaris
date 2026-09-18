import { FileSystemTree } from "@webcontainer/api";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

type FileDoc = Doc<"files">;

const resolvePathParts = (file: FileDoc, filesMap: Map<string, FileDoc>): string[] => {
 const parts: string[] = [];

 const nameParts = file.name.split("/").filter(Boolean);
 parts.push(...nameParts);

 let parentId = file.parentId;
 while (parentId) {
  const parent = filesMap.get(parentId);
  if (!parent) break;
  const parentParts = parent.name.split("/").filter(Boolean);
  parts.unshift(...parentParts);
  parentId = parent.parentId;
 }

 return parts;
};

export const buildFileTree = (files: FileDoc[]): FileSystemTree => {
 const tree: FileSystemTree = {};
 const filesMap = new Map(files.map((f) => [f._id, f]));

 for (const file of files) {
  const pathParts = resolvePathParts(file, filesMap);
  let current = tree;

  for (let i = 0; i < pathParts.length; i++) {
   const part = pathParts[i];
   const isLast = i === pathParts.length - 1;

   if (isLast) {
    if (file.type === "folder") {
     if (!current[part]) {
      current[part] = { directory: {} };
     }
    } else if (!file.storageId && file.content !== undefined) {
     current[part] = { file: { contents: file.content } };
    }
   } else {
    if (!current[part]) {
     current[part] = { directory: {} };
    }
    const node = current[part];
    if ("directory" in node) {
     current = node.directory;
    }
   }
  }
 }

 return tree;
};

export const getFilePath = (file: FileDoc, filesMap: Map<Id<"files">, FileDoc>): string => {
 const parts: string[] = [];
 const nameParts = file.name.split("/").filter(Boolean);
 parts.push(...nameParts);

 let parentId = file.parentId;
 while (parentId) {
  const parent = filesMap.get(parentId);
  if (!parent) break;
  const parentParts = parent.name.split("/").filter(Boolean);
  parts.unshift(...parentParts);
  parentId = parent.parentId;
 }

 return parts.join("/");
};
