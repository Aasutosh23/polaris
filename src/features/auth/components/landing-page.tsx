"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import {
 Sparkles,
 Terminal,
 Cpu,
 GitBranch,
 ArrowRight,
 ShieldCheck,
 Zap,
 Code2,
 Layers,
 Globe,
 CheckCircle2,
 Play,
 FileCode,
 FolderGit2,
 Boxes,
 Flame,
 ChevronRight,
 Star,
 Bot,
 ExternalLink,
 Lock,
 RefreshCw,
 Folder,
 FileText,
 Workflow,
 Command,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const poppins = Poppins({
 subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
 display: "swap",
});

type ShowcaseTab = "ai" | "runtime" | "github";

export const LandingPage = () => {
 const [activeTab, setActiveTab] = useState<ShowcaseTab>("ai");

 return (
  <div className="min-h-screen bg-[#07090E] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
   {/* Dynamic Background Effects */}
   <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] rounded-full" />
    <div className="absolute top-[600px] -left-40 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full" />
    <div className="absolute top-[1200px] -right-40 w-[600px] h-[600px] bg-violet-600/10 blur-[130px] rounded-full" />
    <div
     className="absolute inset-0 opacity-[0.035]"
     style={{
      backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
     }}
    />
   </div>

   {/* Top Banner */}
   <div className="w-full bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-indigo-950/60 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs sm:text-sm text-indigo-200/90 flex items-center justify-center gap-2">
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
     New v2.0
    </span>
    <span>Polaris AI Code Editor: In-Browser WebContainers & Multi-Model Copilot are live!</span>
    <SignUpButton>
     <button className="underline hover:text-white font-medium inline-flex items-center gap-1 transition-colors ml-1 cursor-pointer">
      Try now <ChevronRight className="size-3" />
     </button>
    </SignUpButton>
   </div>

   {/* Navbar */}
   <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/80 border-b border-white/[0.08]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
     {/* Logo */}
     <div className="flex items-center gap-3">
      <div className="relative group">
       <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
       <div className="relative size-9 rounded-lg bg-[#0e111a] border border-white/15 flex items-center justify-center overflow-hidden">
        <Image src="/logo.svg" alt="Polaris Logo" width={28} height={28} className="size-7" />
       </div>
      </div>
      <div className="flex items-center gap-2">
       <span className={cn("text-xl font-bold tracking-tight text-white", poppins.className)}>
        Polaris
       </span>
       <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-white/10 text-zinc-300 border border-white/10">
        Cloud IDE
       </span>
      </div>
     </div>

     {/* Nav Links */}
     <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
      <a href="#features" className="hover:text-white transition-colors">
       Features
      </a>
      <a href="#showcase" className="hover:text-white transition-colors">
       IDE Preview
      </a>
      <a href="#architecture" className="hover:text-white transition-colors">
       Architecture
      </a>
      <a href="#tech-stack" className="hover:text-white transition-colors">
       Tech Stack
      </a>
     </nav>

     {/* Action CTAs */}
     <div className="flex items-center gap-3">
      <SignInButton>
       <Button
        variant="ghost"
        size="sm"
        className="text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
       >
        Sign In
       </Button>
      </SignInButton>

      <SignUpButton>
       <Button
        size="sm"
        className="relative group bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-400 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition-all duration-200 border border-indigo-400/30"
       >
        <Sparkles className="size-3.5 group-hover:rotate-12 transition-transform" />
        <span>Create Account</span>
       </Button>
      </SignUpButton>
     </div>
    </div>
   </header>

   {/* Hero Section */}
   <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
    {/* Release Tag */}
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8 shadow-inner shadow-indigo-500/10">
     <span className="flex size-2 rounded-full bg-indigo-400 animate-pulse" />
     <span className="text-xs sm:text-sm font-medium text-indigo-200">
      Next-Gen AI In-Browser Cloud IDE
     </span>
     <ChevronRight className="size-3 text-indigo-400" />
    </div>

    {/* Main Title */}
    <h1
     className={cn(
      "text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] sm:leading-[1.12]",
      poppins.className
     )}
    >
     Code, Run & Deploy at the{" "}
     <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
      Speed of Thought.
     </span>
    </h1>

    {/* Subtitle */}
    <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
     Polaris brings full-stack development directly into your browser. Run real Node.js runtimes
     with WebContainers, scaffold entire projects with multi-model AI, and sync seamlessly to GitHub
     with zero setup.
    </p>

    {/* Primary Buttons */}
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
     <SignUpButton>
      <Button
       size="lg"
       className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl shadow-xl shadow-indigo-500/25 transition-all duration-200 border border-indigo-400/40 group cursor-pointer"
      >
       <span>Create Free Account</span>
       <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>
     </SignUpButton>

     <SignInButton>
      <Button
       size="lg"
       variant="outline"
       className="w-full sm:w-auto h-12 px-7 text-base font-medium rounded-xl border-white/15 bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 hover:text-white backdrop-blur-md transition-all cursor-pointer"
      >
       <FaGithub className="size-4 mr-2" />
       <span>Sign In with GitHub / Clerk</span>
      </Button>
     </SignInButton>
    </div>

    {/* Value Micro-Points */}
    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-zinc-400">
     <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-emerald-400" />
      <span>Zero install & 0.3s boot</span>
     </div>
     <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-emerald-400" />
      <span>Real Node.js & WebContainers</span>
     </div>
     <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-emerald-400" />
      <span>Powered by Gemini & OpenAI</span>
     </div>
     <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-emerald-400" />
      <span>1-Click GitHub Export</span>
     </div>
    </div>
   </section>

   {/* Interactive IDE Showcase Preview */}
   <section id="showcase" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    {/* Showcase Tab Controls */}
    <div className="flex justify-center mb-6">
     <div className="p-1 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md flex items-center gap-1">
      <button
       onClick={() => setActiveTab("ai")}
       className={cn(
        "px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer",
        activeTab === "ai"
         ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
         : "text-zinc-400 hover:text-white hover:bg-white/5"
       )}
      >
       <Bot className="size-4" />
       <span>AI Multi-Model Scaffolding</span>
      </button>
      <button
       onClick={() => setActiveTab("runtime")}
       className={cn(
        "px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer",
        activeTab === "runtime"
         ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
         : "text-zinc-400 hover:text-white hover:bg-white/5"
       )}
      >
       <Terminal className="size-4" />
       <span>WebContainer Terminal & Preview</span>
      </button>
      <button
       onClick={() => setActiveTab("github")}
       className={cn(
        "px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer",
        activeTab === "github"
         ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
         : "text-zinc-400 hover:text-white hover:bg-white/5"
       )}
      >
       <GitBranch className="size-4" />
       <span>Git Branch & Sync</span>
      </button>
     </div>
    </div>

    {/* IDE Frame */}
    <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0E111A] shadow-2xl shadow-black/80">
     {/* Top Window Bar */}
     <div className="h-11 bg-[#141824] border-b border-white/[0.08] px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
       <div className="size-3 rounded-full bg-[#FF5F56]" />
       <div className="size-3 rounded-full bg-[#FFBD2E]" />
       <div className="size-3 rounded-full bg-[#27C93F]" />
       <div className="ml-3 hidden sm:flex items-center gap-2 text-xs text-zinc-400">
        <Image src="/logo.svg" alt="logo" width={14} height={14} />
        <span className="font-semibold text-zinc-200">polaris-editor</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-400">src / app / page.tsx</span>
       </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
       <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live Node v20 Runtime
       </span>
       <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 font-mono text-[11px]">
        git: (main)
       </span>
       <SignUpButton>
        <button className="text-xs px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition cursor-pointer">
         Run Project
        </button>
       </SignUpButton>
      </div>
     </div>

     {/* IDE Content Layout */}
     <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
      {/* Sidebar (File Tree) */}
      <div className="hidden lg:block lg:col-span-3 bg-[#0B0D14] border-r border-white/[0.08] p-3 text-xs font-mono">
       <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
        <span>Explorer</span>
        <FolderGit2 className="size-3.5 text-zinc-500" />
       </div>

       <div className="space-y-1 text-zinc-300">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-indigo-300">
         <Folder className="size-3.5 text-indigo-400" />
         <span>src</span>
        </div>
        <div className="pl-4 space-y-1">
         <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-indigo-300">
          <Folder className="size-3.5 text-indigo-400" />
          <span>app</span>
         </div>
         <div className="pl-4 space-y-1">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/15 text-indigo-200 border border-indigo-500/30">
           <FileCode className="size-3.5 text-blue-400" />
           <span>page.tsx</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-zinc-400">
           <FileText className="size-3.5 text-zinc-500" />
           <span>layout.tsx</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-zinc-400">
           <FileText className="size-3.5 text-zinc-500" />
           <span>globals.css</span>
          </div>
         </div>

         <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-zinc-400">
          <Folder className="size-3.5 text-yellow-500/70" />
          <span>components</span>
         </div>
         <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-zinc-400">
          <Folder className="size-3.5 text-emerald-500/70" />
          <span>convex</span>
         </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] mt-2 space-y-1">
         <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-amber-300/80">
          <FileCode className="size-3.5" />
          <span>package.json</span>
         </div>
         <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-zinc-400">
          <FileText className="size-3.5" />
          <span>tsconfig.json</span>
         </div>
        </div>
       </div>

       {/* AI Assistant Mini Status */}
       <div className="mt-8 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
         <Sparkles className="size-3.5 text-indigo-400" />
         <span>Polaris AI Agent</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-normal">
         Context loaded: 14 files indexed. Ready for instant prompt synthesis.
        </p>
       </div>
      </div>

      {/* Center Code Editor Pane */}
      <div className="lg:col-span-5 bg-[#0E111A] flex flex-col border-r border-white/[0.08]">
       {/* Tab Header */}
       <div className="h-9 bg-[#111420] border-b border-white/[0.08] flex items-center px-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0E111A] border-t-2 border-indigo-500 text-xs text-zinc-200 font-mono">
         <FileCode className="size-3.5 text-blue-400" />
         <span>page.tsx</span>
        </div>
       </div>

       {/* Code Editor Content */}
       <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300 flex-1">
        {activeTab === "ai" && (
         <div className="space-y-1">
          <div className="text-zinc-500">// ⚡ Generated by Polaris AI Copilot in 420ms</div>
          <div>
           <span className="text-purple-400">import</span> &#123; useState, useEffect &#125;{" "}
           <span className="text-purple-400">from</span>{" "}
           <span className="text-emerald-300">&quot;react&quot;</span>;
          </div>
          <div>
           <span className="text-purple-400">import</span> &#123; useQuery &#125;{" "}
           <span className="text-purple-400">from</span>{" "}
           <span className="text-emerald-300">&quot;convex/react&quot;</span>;
          </div>
          <div>
           <span className="text-purple-400">import</span> &#123; api &#125;{" "}
           <span className="text-purple-400">from</span>{" "}
           <span className="text-emerald-300">&quot;../convex/_generated/api&quot;</span>;
          </div>
          <div className="h-2" />
          <div>
           <span className="text-blue-400">export default function</span>{" "}
           <span className="text-yellow-300">Dashboard</span>() &#123;
          </div>
          <div className="pl-4">
           <span className="text-blue-400">const</span> projects ={" "}
           <span className="text-cyan-400">useQuery</span>(api.projects.getRecent);
          </div>
          <div className="pl-4">
           <span className="text-blue-400">const</span> [active, setActive] ={" "}
           <span className="text-cyan-400">useState</span>(
           <span className="text-emerald-300">&quot;prod&quot;</span>);
          </div>
          <div className="h-2" />
          <div className="pl-4">
           <span className="text-blue-400">return</span> (
          </div>
          <div className="pl-8 text-blue-300">
           &lt;<span className="text-red-400">main</span>{" "}
           <span className="text-amber-300">className</span>=
           <span className="text-emerald-300">&quot;flex min-h-screen bg-slate-950&quot;</span>&gt;
          </div>
          <div className="pl-12 text-blue-300">
           &lt;<span className="text-yellow-400">WorkspaceLayout</span>{" "}
           <span className="text-amber-300">items</span>=&#123;projects&#125; /&gt;
          </div>
          <div className="pl-8 text-blue-300">
           &lt;/<span className="text-red-400">main</span>&gt;
          </div>
          <div className="pl-4">);</div>
          <div>&#125;</div>

          {/* AI Suggestion Overlay Banner */}
          <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-sm">
           <div className="flex items-center justify-between text-indigo-300 mb-1">
            <span className="font-semibold flex items-center gap-1.5">
             <Sparkles className="size-3.5 text-indigo-400" />
             AI Refactor Complete
            </span>
            <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-200">
             Applied
            </span>
           </div>
           <p className="text-[11px] text-zinc-300">
            Added reactive Convex hook and instant real-time synchronization.
           </p>
          </div>
         </div>
        )}

        {activeTab === "runtime" && (
         <div className="space-y-1">
          <div className="text-zinc-500">// ⚡ WebContainer Node.js API Server Handler</div>
          <div>
           <span className="text-purple-400">import</span> &#123; createServer &#125;{" "}
           <span className="text-purple-400">from</span>{" "}
           <span className="text-emerald-300">&quot;node:http&quot;</span>;
          </div>
          <div className="h-2" />
          <div>
           <span className="text-blue-400">const</span> server ={" "}
           <span className="text-cyan-400">createServer</span>((req, res) =&gt; &#123;
          </div>
          <div className="pl-4">
           res.<span className="text-cyan-400">writeHead</span>(
           <span className="text-orange-400">200</span>, &#123;{" "}
           <span className="text-emerald-300">&quot;Content-Type&quot;</span>:{" "}
           <span className="text-emerald-300">&quot;application/json&quot;</span> &#125;);
          </div>
          <div className="pl-4">
           res.<span className="text-cyan-400">end</span>(JSON.
           <span className="text-cyan-400">stringify</span>(&#123; status:{" "}
           <span className="text-emerald-300">&quot;running in browser WebContainer&quot;</span>{" "}
           &#125;));
          </div>
          <div>&#125;);</div>
          <div className="h-2" />
          <div>
           server.<span className="text-cyan-400">listen</span>(
           <span className="text-orange-400">3000</span>, () =&gt; &#123;
          </div>
          <div className="pl-4">
           console.<span className="text-cyan-400">log</span>(
           <span className="text-emerald-300">
            &quot;✓ Node.js micro-kernel started at port 3000&quot;
           </span>
           );
          </div>
          <div>&#125;);</div>
         </div>
        )}

        {activeTab === "github" && (
         <div className="space-y-1">
          <div className="text-zinc-500">// ⚡ Git Synchronization & Commit Payload</div>
          <div>
           <span className="text-blue-400">const</span> commitConfig = &#123;
          </div>
          <div className="pl-4">
           branch: <span className="text-emerald-300">&quot;main&quot;</span>,
          </div>
          <div className="pl-4">
           message:{" "}
           <span className="text-emerald-300">
            &quot;feat: initialize Polaris full-stack scaffold&quot;
           </span>
           ,
          </div>
          <div className="pl-4">
           filesChanged: <span className="text-orange-400">8</span>,
          </div>
          <div className="pl-4">
           remoteRepo: <span className="text-emerald-300">&quot;polaris/cloud-ide&quot;</span>,
          </div>
          <div className="pl-4">
           syncStatus: <span className="text-emerald-400">&quot;synced&quot;</span>
          </div>
          <div>&#125;;</div>
          <div className="h-2" />
          <div className="text-emerald-400 font-mono">
           // Ready to export directly to GitHub with 1 click
          </div>
         </div>
        )}
       </div>
      </div>

      {/* Right Split: Terminal & Live Preview */}
      <div className="lg:col-span-4 bg-[#0B0E17] flex flex-col">
       {/* Live Preview Header */}
       <div className="h-9 bg-[#111420] border-b border-white/[0.08] px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-300">
         <Globe className="size-3.5 text-emerald-400" />
         <span>Preview: localhost:3000</span>
        </div>
        <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
       </div>

       {/* Simulated Live Web App Output */}
       <div className="p-4 bg-gradient-to-b from-[#0F1322] to-[#0A0D17] flex-1 flex flex-col justify-center items-center text-center border-b border-white/[0.08]">
        <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
         <Zap className="size-6 text-indigo-400" />
        </div>
        <h4 className="text-sm font-semibold text-white">Full-Stack Application</h4>
        <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
         Hot module replacement active. 0ms local roundtrip.
        </p>
        <div className="mt-4 flex gap-2">
         <div className="px-3 py-1 rounded bg-indigo-600/80 text-[11px] font-medium text-white shadow-xs">
          Button Clicked: 42
         </div>
         <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-300">
          200 OK
         </div>
        </div>
       </div>

       {/* Simulated Interactive Terminal */}
       <div className="h-40 bg-[#06080F] p-3 font-mono text-[11px] text-zinc-400 overflow-y-auto">
        <div className="flex items-center justify-between text-zinc-500 border-b border-white/5 pb-1 mb-2">
         <span className="flex items-center gap-1">
          <Terminal className="size-3" />
          bash - WebContainer xterm
         </span>
         <span className="text-[10px] text-emerald-400">ready</span>
        </div>
        <p className="text-emerald-400">$ npm run dev</p>
        <p className="text-zinc-300">&gt; polaris-app@0.1.0 dev</p>
        <p className="text-zinc-300">&gt; next dev --turbo</p>
        <p className="text-blue-400">▲ Next.js 16.1.1 (Turbopack)</p>
        <p className="text-zinc-400">- Local: http://localhost:3000</p>
        <p className="text-emerald-400 font-semibold">✓ Compiled client and server in 218ms</p>
        <div className="flex items-center gap-1 text-zinc-200 mt-1">
         <span className="text-indigo-400">$</span>
         <span className="size-2 bg-indigo-400 animate-pulse" />
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Feature Bento Grid */}
   <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="text-center max-w-3xl mx-auto mb-16">
     <h2 className={cn("text-3xl sm:text-5xl font-extrabold tracking-tight", poppins.className)}>
      Engineered for developers who love{" "}
      <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
       pure speed.
      </span>
     </h2>
     <p className="mt-4 text-base sm:text-lg text-zinc-400">
      No local dependencies, no environment drift, no configuration nightmares. Everything you need
      is built right into your browser tab.
     </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     {/* Card 1: Wide Bento */}
     <div className="md:col-span-2 relative group rounded-2xl p-8 bg-gradient-to-b from-[#111422] to-[#0A0D16] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
       <Bot className="size-48 text-indigo-400" />
      </div>
      <div className="p-3 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
       <Sparkles className="size-6" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
       Multi-Model AI Coding Assistant
      </h3>
      <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed mb-6">
       Prompt Polaris to scaffold whole projects, refactor components, build database schemas, or
       troubleshoot errors. Powered by Google Gemini and OpenAI reasoning models with full
       repository context.
      </p>
      <div className="flex flex-wrap gap-2 text-xs font-mono">
       <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300">
        Natural Language Project Generation
       </span>
       <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300">
        Multi-Turn Chat Context
       </span>
       <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-300">
        Quick Edit & Diff Previews
       </span>
      </div>
     </div>

     {/* Card 2 */}
     <div className="relative group rounded-2xl p-8 bg-gradient-to-b from-[#111422] to-[#0A0D16] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="p-3 w-fit rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
       <Terminal className="size-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">WebContainers Micro-OS</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
       Real Node.js execution natively in the browser. Run npm scripts, spin up servers, and execute
       commands in an sandboxed WebAssembly kernel.
      </p>
      <div className="text-xs text-blue-400 font-mono">
       ⚡ 0ms server latency • 100% offline ready
      </div>
     </div>

     {/* Card 3 */}
     <div className="relative group rounded-2xl p-8 bg-gradient-to-b from-[#111422] to-[#0A0D16] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6">
       <GitBranch className="size-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Bi-Directional GitHub Flow</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
       Import any public or private GitHub repository in one click. Push changes back to any branch
       with clean git commit histories.
      </p>
      <div className="text-xs text-purple-400 font-mono">🐙 Seamless GitHub OAuth integration</div>
     </div>

     {/* Card 4 */}
     <div className="relative group rounded-2xl p-8 bg-gradient-to-b from-[#111422] to-[#0A0D16] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
       <ShieldCheck className="size-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Convex Realtime Database</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
       Every keystroke and project state is synchronized instantly with reactive cloud
       subscriptions. You will never lose unsaved changes again.
      </p>
      <div className="text-xs text-emerald-400 font-mono">🔒 Instant cloud snapshots & sync</div>
     </div>

     {/* Card 5 */}
     <div className="relative group rounded-2xl p-8 bg-gradient-to-b from-[#111422] to-[#0A0D16] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden shadow-lg">
      <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6">
       <Code2 className="size-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">CodeMirror 6 Editor Engine</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">
       Engineered with modern CodeMirror 6, syntax highlighters for TypeScript, Python, HTML, CSS,
       JSON, minimap navigation, and indentation guides.
      </p>
      <div className="text-xs text-amber-400 font-mono">🎨 Tailored dark mode & fast typing</div>
     </div>
    </div>
   </section>

   {/* Tech Stack Banner */}
   <section id="tech-stack" className="py-16 border-y border-white/[0.08] bg-[#0A0D16]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
     <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-8">
      Built on Industry-Leading Architecture
     </p>

     <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-zinc-300">
      <div className="flex items-center gap-2.5 font-medium hover:text-white transition">
       <span className="size-3 rounded-full bg-white" />
       <span>Next.js 16 (Turbopack)</span>
      </div>
      <div className="flex items-center gap-2.5 font-medium hover:text-white transition">
       <span className="size-3 rounded-full bg-blue-500" />
       <span>WebContainers API</span>
      </div>
      <div className="flex items-center gap-2.5 font-medium hover:text-white transition">
       <span className="size-3 rounded-full bg-orange-500" />
       <span>Convex Realtime DB</span>
      </div>
      <div className="flex items-center gap-2.5 font-medium hover:text-white transition">
       <span className="size-3 rounded-full bg-indigo-500" />
       <span>Clerk Auth</span>
      </div>
      <div className="flex items-center gap-2.5 font-medium hover:text-white transition">
       <span className="size-3 rounded-full bg-cyan-400" />
       <span>Tailwind CSS 4</span>
      </div>
      <div className="flex items-center gap-2.5 font-medium hover:text-white transition">
       <span className="size-3 rounded-full bg-purple-500" />
       <span>Google Gemini AI</span>
      </div>
     </div>
    </div>
   </section>

   {/* Bottom Conversion CTA */}
   <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
    <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-b from-indigo-900/40 via-[#101424] to-[#0A0D16] border border-indigo-500/30 overflow-hidden shadow-2xl shadow-indigo-950/60">
     <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-72 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

     <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
       <Flame className="size-3.5 text-indigo-400" />
       Start Coding In Seconds
      </div>

      <h2
       className={cn(
        "text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-2xl mx-auto",
        poppins.className
       )}
      >
       Ready to build without setup friction?
      </h2>

      <p className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
       Create your account today and experience instantaneous cloud development with AI superpowers.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
       <SignUpButton>
        <Button
         size="lg"
         className="w-full sm:w-auto h-13 px-8 text-base font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl shadow-xl shadow-indigo-500/30 transition-all border border-indigo-400/40 group cursor-pointer"
        >
         <Sparkles className="size-4 mr-1 group-hover:rotate-12 transition-transform" />
         <span>Create Account — Free</span>
         <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
       </SignUpButton>

       <SignInButton>
        <Button
         size="lg"
         variant="outline"
         className="w-full sm:w-auto h-13 px-7 text-base font-medium rounded-xl border-white/20 bg-white/[0.05] hover:bg-white/10 text-white backdrop-blur-md transition-all cursor-pointer"
        >
         <span>Sign In</span>
        </Button>
       </SignInButton>
      </div>

      <p className="text-xs text-zinc-400 mt-6">
       Instant access • No credit card required • Securely authenticated by Clerk
      </p>
     </div>
    </div>
   </section>

   {/* Footer */}
   <footer className="border-t border-white/[0.08] bg-[#05070D] py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-400">
     <div className="flex items-center gap-3">
      <Image src="/logo.svg" alt="Polaris Logo" width={22} height={22} />
      <span className={cn("text-base font-bold text-white tracking-tight", poppins.className)}>
       Polaris
      </span>
      <span className="text-zinc-600">|</span>
      <span className="text-xs text-zinc-400">The AI Cloud Code Editor</span>
     </div>

     <div className="flex items-center gap-6 text-xs sm:text-sm">
      <a href="#features" className="hover:text-white transition">
       Features
      </a>
      <a href="#showcase" className="hover:text-white transition">
       IDE Preview
      </a>
      <a
       href="https://github.com"
       target="_blank"
       rel="noreferrer"
       className="hover:text-white transition flex items-center gap-1"
      >
       <FaGithub className="size-3.5" />
       <span>GitHub</span>
      </a>
     </div>

     <div className="text-xs text-zinc-500">
      &copy; {new Date().getFullYear()} Polaris. Built with Next.js, WebContainers & Convex.
     </div>
    </div>
   </footer>
  </div>
 );
};
