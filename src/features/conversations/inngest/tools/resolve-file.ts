import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";

export type FileDoc = Doc<"files">;

export const loadProjectFiles = async (internalKey: string, projectId: Id<"projects">) => {
 return await convex.query(api.system.getProjectFiles, { internalKey, projectId });
};

const buildPathFn = (files: FileDoc[]) => {
 const byId = new Map<string, FileDoc>(files.map((f) => [f._id, f]));

 return (file: FileDoc) => {
  const parts = [file.name];
  let current = file;

  while (current.parentId) {
   const parent = byId.get(current.parentId);
   if (!parent) break;
   parts.unshift(parent.name);
   current = parent;
  }

  return parts.join("/");
 };
};

export type FindResult = { ok: true; file: FileDoc } | { ok: false; error: string };

/** Accepts a Convex ID, a full path ("src/main.tsx") or a plain name ("main.tsx"). */
export const findFile = (files: FileDoc[], ref: string): FindResult => {
 const wanted = ref.trim().replace(/^\/+/, "").replace(/\/+$/, "");

 if (!wanted) {
  return { ok: false, error: "File reference is empty" };
 }

 const byId = files.find((f) => f._id === wanted);
 if (byId) return { ok: true, file: byId };

 const pathOf = buildPathFn(files);

 const exact = files.filter((f) => pathOf(f) === wanted);
 if (exact.length === 1) return { ok: true, file: exact[0] };

 const loose = files.filter((f) => f.name === wanted || pathOf(f).endsWith("/" + wanted));
 if (loose.length === 1) return { ok: true, file: loose[0] };

 if (loose.length > 1) {
  const options = loose.map((f) => `${pathOf(f)} (id: ${f._id})`).join(", ");
  return {
   ok: false,
   error: `"${ref}" matches several items: ${options}. Use the ID or the full path.`,
  };
 }

 return { ok: false, error: `"${ref}" was not found. Use listFiles to see valid IDs.` };
};

export const resolveParent = (
 files: FileDoc[],
 parentRef: string
): { ok: true; parentId: Id<"files"> | undefined } | { ok: false; error: string } => {
 if (!parentRef || parentRef.trim() === "") {
  return { ok: true, parentId: undefined };
 }

 const found = findFile(files, parentRef);
 if (!found.ok) return found;

 if (found.file.type !== "folder") {
  return { ok: false, error: `"${parentRef}" is a file, not a folder. Use a folder as parent.` };
 }

 return { ok: true, parentId: found.file._id };
};
