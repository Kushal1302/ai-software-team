"use client";

import React from "react";
import {
  Cpu,
  Brain,
  Activity,
  Wrench,
  Lock,
  Database,
  Terminal as TerminalIcon,
  FolderIcon,
  LucideIcon,
  Network,
  Rocket,
  Flame,
  Target,
  AlertTriangle,
  Star,
} from "lucide-react";

// --- macOS Window Wrapper ---
const MacOSWindow = ({
  title,
  children,
  icon: Icon,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
  className?: string;
}) => (
  <div
    className={`rounded-xl border border-white/10 bg-[#161616]/80 backdrop-blur-2xl shadow-2xl overflow-hidden h-full ${className}`}
  >
    {/* Window Header */}
    <div className="h-10 flex items-center px-4 bg-white/5 border-b border-white/5 relative shrink-0">
      <div className="flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 opacity-50">
          {Icon && <Icon className="w-3 h-3" />}
          <span className="text-[11px] font-medium tracking-tight font-sans text-zinc-300">
            {title}
          </span>
        </div>
      </div>
    </div>
    {/* Window Content */}
    <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
  </div>
);

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-6 md:p-12 lg:p-20 font-sans selection:bg-cyan-500/30 overflow-y-auto custom-scrollbar relative">
      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="p-4 bg-white/5 rounded-3xl border border-white/10 mb-6 backdrop-blur-md shadow-2xl">
            <Cpu className="w-12 h-12 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
            AI Software <span className="text-cyan-500 italic">Team</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-sm leading-relaxed uppercase tracking-[0.2em] font-medium">
            Autonomous multi-agent engineering runtime built with LangGraph
          </p>
        </div>

        {/* TOP ROW: CORE & FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <MacOSWindow title="README.md" icon={FolderIcon}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-cyan-400" /> Introduction
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    This project simulates a real AI engineering organization
                    where specialized agents collaborate to analyze
                    repositories, retrieve code context, modify implementations,
                    validate changes, and stream runtime activity live to the
                    UI.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">
                    🤖 Multi-Agent Architecture
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Intent Classifier",
                      "Strategic Planner",
                      "Repository Searcher",
                      "Task Classifier",
                      "Backend Engineer",
                      "Frontend Engineer",
                      "Reviewer",
                      "Validator",
                      "Change Summary",
                      "Answer Agent",
                    ].map((agent) => (
                      <span
                        key={agent}
                        className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </MacOSWindow>
          </div>

          <div className="lg:col-span-5">
            <MacOSWindow
              title="Setup.zsh"
              icon={TerminalIcon}
              className="bg-black/40"
            >
              <div className="font-mono text-[12px] space-y-6">
                <div>
                  <div className="flex gap-2 text-emerald-500 mb-1">
                    <span>➜</span>
                    <span>Install Dependencies</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5 text-zinc-300">
                    npm install
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 text-emerald-500 mb-1">
                    <span>➜</span>
                    <span>Run ChromaDB</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5 text-zinc-300">
                    docker run -p 8000:8000 chromadb/chroma
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 text-cyan-400 mb-1">
                    <span>➜</span>
                    <span>Launch Systems</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5 text-zinc-300">
                    npm run dev
                  </div>
                </div>
              </div>
            </MacOSWindow>
          </div>
        </div>

        {/* MIDDLE ROW: ARCHITECTURE & MEMORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MacOSWindow title="Architecture.drawio" icon={Network}>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Runtime Pipeline</h3>
              <div className="space-y-2">
                {[
                  "User Task",
                  "Intent Classifier",
                  "Planner",
                  "Searcher",
                  "Engineer",
                  "Validator",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                      {i + 1}
                    </div>
                    <span className="text-xs text-zinc-400">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </MacOSWindow>

          <MacOSWindow title="MemorySystem.ts" icon={Brain}>
            <div className="space-y-4">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Persistent semantic memory learns repository architecture,
                conventions, and recurring failures.
              </p>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-[10px] font-bold text-purple-400 mb-2 uppercase tracking-tighter">
                  Memory Retrieval Loop
                </div>
                <div className="text-[10px] font-mono text-zinc-500 space-y-1">
                  <div>1. Extraction</div>
                  <div>2. Embedding Gen</div>
                  <div>3. Vector Storage</div>
                  <div>4. Semantic Retrieval</div>
                </div>
              </div>
            </div>
          </MacOSWindow>

          <MacOSWindow title="Tools.json" icon={Wrench}>
            <div className="space-y-3">
              {[
                { cat: "Intelligence", items: "search, read, grep" },
                { cat: "Engineering", items: "patch, diff, terminal" },
                { cat: "Validation", items: "build, typecheck, lint" },
              ].map((tool) => (
                <div
                  key={tool.cat}
                  className="border-b border-zinc-800/50 pb-2 last:border-0"
                >
                  <div className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">
                    {tool.cat}
                  </div>
                  <div className="text-xs text-cyan-500/70 font-mono">
                    {tool.items}
                  </div>
                </div>
              ))}
            </div>
          </MacOSWindow>
        </div>

        {/* GRID: TECH STACK & EVENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MacOSWindow title="TechStack.yml" icon={Database}>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">
                  Backend
                </h4>
                <ul className="text-xs space-y-2 text-zinc-300">
                  <li>• TypeScript / Node.js</li>
                  <li>• LangGraph Orchestration</li>
                  <li>• Hono Framework</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 tracking-widest">
                  Frontend
                </h4>
                <ul className="text-xs space-y-2 text-zinc-300">
                  <li>• Next.js / React</li>
                  <li>• ReactFlow Visualization</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
            </div>
          </MacOSWindow>

          <MacOSWindow title="Events.ts" icon={Activity}>
            <div className="font-mono text-[11px] text-zinc-400 bg-black/20 p-4 rounded-lg border border-white/5">
              <span className="text-purple-400">type</span>{" "}
              <span className="text-white">RuntimeEvent</span> = <br />
              &nbsp;&nbsp;| <span className="text-cyan-400">
                &quot;agent&quot;
              </span> | <span className="text-cyan-400">&quot;tool&quot;</span> <br />
              &nbsp;&nbsp;| <span className="text-cyan-400">
                &quot;terminal&quot;
              </span> | <span className="text-cyan-400">&quot;diff&quot;</span> <br />
              &nbsp;&nbsp;| <span className="text-cyan-400">
                &quot;approval&quot;
              </span> | <span className="text-cyan-400">&quot;log&quot;</span>;
            </div>
            <p className="mt-4 text-[10px] text-zinc-500 uppercase tracking-widest">
              Real-time streaming via Server-Sent Events (SSE)
            </p>
          </MacOSWindow>
        </div>

        {/* FINAL ROW: GOALS, FUTURE, DISCLAIMER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MacOSWindow title="Tasks.txt" icon={Flame}>
            <div className="text-[11px] space-y-2 font-mono">
              <div className="text-zinc-500 italic">Example Requests:</div>
              <div className="text-zinc-300">- Add auth request logging</div>
              <div className="text-zinc-300">- Fix Prisma validation issue</div>
              <div className="text-zinc-300">- Implement dark mode toggle</div>
            </div>
          </MacOSWindow>

          <MacOSWindow title="Future.log" icon={Target}>
            <ul className="text-[10px] space-y-2 text-zinc-400 uppercase tracking-tighter">
              <li>• Durable Workflow Resumption</li>
              <li>• Playwright Browser Agent</li>
              <li>• AST-safe Code Editing</li>
              <li>• Multi-Repo Intelligence</li>
            </ul>
          </MacOSWindow>

          <MacOSWindow title="Security.md" icon={Lock}>
            <div className="flex gap-3 text-amber-500/80">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div className="text-[10px] leading-relaxed">
                Experimental system. Dangerous operations (rm, push) require
                <span className="text-white font-bold">
                  {" "}
                  Human Approval Gates
                </span>
                . Always review generated code.
              </div>
            </div>
          </MacOSWindow>
        </div>

        {/* CALL TO ACTION */}
        <div className="flex flex-col items-center justify-center pt-20 pb-10 space-y-6">
          <div onClick={() => window.open("https://github.com/Kushal1302/ai-software-team", "_blank")} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm cursor-pointer hover:bg-cyan-400 transition-all">
            <Star className="w-4 h-4 fill-black" />
            <span>STAR REPOSITORY ON GITHUB</span>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
            End of Documentation — Autonomous AI Engineering System
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
