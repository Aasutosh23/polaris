import Image from "next/image";
import { useEffect, useRef } from "react";

import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";

import { useEditor } from "../hooks/use-editor";
import { CodeEditor } from "./code-editor";
import { TopNavigation } from "./top-navigation";
import { FileBreadcrumbs } from "./file-breadcrumbs";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangleIcon } from "lucide-react";

const DEBOUNCE_MS = 1500;

const IMAGE_EXTENSIONS = new Set([
 "png",
 "jpg",
 "jpeg",
 "gif",
 "webp",
 "svg",
 "bmp",
 "ico",
 "avif",
]);

function BinaryFilePreview({ name, storageUrl }: { name: string; storageUrl: string | null }) {
 const ext = name.split(".").pop()?.toLowerCase() ?? "";
 const isImage = IMAGE_EXTENSIONS.has(ext);

 if (isImage && storageUrl) {
  return (
   <div className="size-full flex items-center justify-center p-8 overflow-auto">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
     src={storageUrl}
     alt={name}
     style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px" }}
    />
   </div>
  );
 }

 return (
  <div className="size-full flex items-center justify-center">
   <div className="flex flex-col items-center gap-2.5 max-w-md text-center">
    <AlertTriangleIcon className="size-10 text-yellow-500" />
    <p className="text-sm">
     The file is not displayed in the text editor because it is either binary or uses an unsupported
     text encoding.
    </p>
   </div>
  </div>
 );
}

export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
 const { activeTabId, closeTab } = useEditor(projectId);
 const activeFile = useFile(activeTabId);
 const updateFile = useUpdateFile();
 const timeoutRef = useRef<NodeJS.Timeout | null>(null);

 const isActiveFileBinary = activeFile && activeFile.storageId;
 const isActiveFileText = activeFile && !activeFile.storageId;

 useEffect(() => {
  if (activeTabId && activeFile === null) {
   closeTab(activeTabId);
  }
 }, [activeFile, activeTabId, closeTab]);

 useEffect(() => {
  return () => {
   if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
   }
  };
 }, [activeTabId]);

 return (
  <div className="h-full flex flex-col">
   <div className="flex items-center">
    <TopNavigation projectId={projectId} />
   </div>
   {activeTabId && <FileBreadcrumbs projectId={projectId} />}
   <div className="flex-1 min-h-0 bg-background">
    {!activeFile && (
     <div className="size-full flex items-center justify-center">
      <Image src="/logo-alt.svg" alt="Polaris" width={50} height={50} className="opacity-25" />
     </div>
    )}
    {isActiveFileText && (
     <CodeEditor
      key={activeFile._id}
      fileName={activeFile.name}
      initialValue={activeFile.content}
      onChange={(content: string) => {
       if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
       }

       timeoutRef.current = setTimeout(() => {
        updateFile({ id: activeFile._id, content });
       }, DEBOUNCE_MS);
      }}
     />
    )}
    {isActiveFileBinary && (
     <BinaryFilePreview
      name={activeFile.name}
      storageUrl={"storageUrl" in activeFile ? (activeFile.storageUrl as string | null) : null}
     />
    )}
   </div>
  </div>
 );
};
