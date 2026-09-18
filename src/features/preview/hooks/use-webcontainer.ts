import { useCallback, useEffect, useRef, useState } from "react";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";

import { buildFileTree, getFilePath } from "@/features/preview/utils/file-tree";
import { useFiles } from "@/features/projects/hooks/use-files";

import { Id } from "../../../../convex/_generated/dataModel";

let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

const getWebContainer = async (): Promise<WebContainer> => {
 if (webcontainerInstance) {
  return webcontainerInstance;
 }

 if (!bootPromise) {
  bootPromise = WebContainer.boot({ coep: "credentialless" });
 }

 webcontainerInstance = await bootPromise;
 return webcontainerInstance;
};

interface UseWebContainerProps {
 projectId: Id<"projects">;
 enabled: boolean;
 settings?: {
  installCommand?: string;
  devCommand?: string;
 };
}

export const useWebContainer = ({ projectId, enabled, settings }: UseWebContainerProps) => {
 const [status, setStatus] = useState<"idle" | "booting" | "installing" | "running" | "error">(
  "idle"
 );

 const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [restartKey, setRestartKey] = useState(0);
 const [terminalOutput, setTerminalOutput] = useState<string>("");

 const containerRef = useRef<WebContainer | null>(null);
 const hasStartedRef = useRef(false);
 // Track the running dev process so we can kill it on restart
 const devProcessRef = useRef<WebContainerProcess | null>(null);

 const files = useFiles(projectId);

 useEffect(() => {
  if (!enabled || !files || files.length === 0 || hasStartedRef.current) {
   return;
  }

  hasStartedRef.current = true;

  const start = async () => {
   try {
    setStatus("booting");
    setError(null);
    setTerminalOutput("");

    const appendOutput = (data: string) => {
     setTerminalOutput((prev) => prev + data);
    };

    const container = await getWebContainer();
    containerRef.current = container;

    const fileTree = buildFileTree(files);
    await container.mount(fileTree);

    container.on("server-ready", (_port, url) => {
     setPreviewUrl(url);
     setStatus("running");
    });

    setStatus("installing");

    const installCmd = settings?.installCommand || "npm install";
    const isDefaultInstall = !settings?.installCommand;
    const [installBin, ...installArgs] = installCmd.split(" ");

    const safeInstallArgs = isDefaultInstall
     ? [...installArgs, "--prefer-offline", "--no-audit", "--no-fund", "--legacy-peer-deps"]
     : installArgs;

    appendOutput(`$ ${installBin} ${safeInstallArgs.join(" ")}\n`);
    const installProcess = await container.spawn(installBin, safeInstallArgs);
    installProcess.output.pipeTo(
     new WritableStream({
      write(data) {
       appendOutput(data);
      },
     })
    );

    const installExitCode = await Promise.race([
     installProcess.exit,
     new Promise<number>((_, reject) =>
      setTimeout(() => reject(new Error("npm install timed out after 3 minutes")), 3 * 60 * 1000)
     ),
    ]);

    if (installExitCode !== 0) {
     throw new Error(`${installCmd} failed with code ${installExitCode}`);
    }

    const devCmd = settings?.devCommand || "npm run dev";
    const [devBin, ...devArgs] = devCmd.split(" ");
    appendOutput(`\n$ ${devCmd}\n`);
    const devProcess = await container.spawn(devBin, devArgs);
    devProcessRef.current = devProcess;
    devProcess.output.pipeTo(
     new WritableStream({
      write(data) {
       appendOutput(data);
      },
     })
    );
   } catch (error) {
    setError(error instanceof Error ? error.message : "Unknown error");
    setStatus("error");
   }
  };

  start();
 }, [enabled, files, restartKey, settings?.devCommand, settings?.installCommand]);

 useEffect(() => {
  const container = containerRef.current;
  if (!container || !files || status !== "running") return;

  const filesMap = new Map(files.map((f) => [f._id, f]));

  const syncFiles = async () => {
   for (const file of files) {
    if (file.type !== "file" || file.storageId || !file.content) continue;

    const filePath = getFilePath(file, filesMap);

    // Ensure parent directory exists before writing (prevents EIO: invalid file name)
    const lastSlash = filePath.lastIndexOf("/");
    if (lastSlash > 0) {
     const dirPath = filePath.substring(0, lastSlash);
     try {
      await container.fs.mkdir(dirPath, { recursive: true });
     } catch {}
    }

    try {
     await container.fs.writeFile(filePath, file.content);
    } catch (err) {
     console.warn(`[WebContainer] Failed to sync file ${filePath}:`, err);
    }
   }
  };

  syncFiles();
 }, [files, status]);

 useEffect(() => {
  if (!enabled) {
   hasStartedRef.current = false;
   setStatus("idle");
   setPreviewUrl(null);
   setError(null);
  }
 }, [enabled]);

 const restart = useCallback(() => {
  if (devProcessRef.current) {
   devProcessRef.current.kill();
   devProcessRef.current = null;
  }

  hasStartedRef.current = false;
  setStatus("idle");
  setPreviewUrl(null);
  setError(null);
  setTerminalOutput("");
  setRestartKey((k) => k + 1);
 }, []);

 return {
  status,
  previewUrl,
  error,
  restart,
  terminalOutput,
 };
};
