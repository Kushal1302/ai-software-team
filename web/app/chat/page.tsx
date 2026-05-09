"use client";

import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import {
  Send,
  Cpu,
  Activity,
  GitBranch,
  Terminal as TerminalIcon,
  Maximize2,
  Network,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { RuntimeEvent } from "@/types/runtime";
import { buildEdges, buildNodes } from "@/lib/build.graph";
import { DiffEditor } from "@monaco-editor/react";
import { ENV } from "@/lib/env";
import { updateNodes } from "@/lib/update-nodes";
import { useSearchParams, useRouter } from "next/navigation";

type ActiveTabType = "graph" | "terminal" | "diff";

// 1. Move all the page logic into a nested content component
function ChatPageContent() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<RuntimeEvent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>();
  const [baseNodes, setBaseNodes] = useState<Node[]>([]);
  const [diff, setDiff] = useState("");
  const [edges, setEdges] = useState<Edge[]>([]);
  const [approval, setApproval] = useState<RuntimeEvent | null>(null);

  const router = useRouter();

  // useSearchParams safe call inside a component that will be wrapped in Suspense
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as ActiveTabType;

  // Mobile / Tablet Tab System state
  const activeTab = initialTab || "graph";

  const scrollRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(
    () => updateNodes(baseNodes, activeAgent),
    [baseNodes, activeAgent],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  useEffect(() => {
    const eventSource = new EventSource(`${ENV.API_BASE_URL}/events`);
    eventSource.addEventListener("runtime-event", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "agent") setActiveAgent(data.agentId);
      if (data.type === "diff") setDiff(data.message);
      if (data.type === "approval") {
        setApproval(data);
      }
      setLogs((prev) => [...prev, data]);
    });
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    async function loadGraph() {
      const response = await fetch(`${ENV.API_BASE_URL}/graph`);
      const data = await response.json();
      setBaseNodes(buildNodes(data.nodes));
      setEdges(buildEdges(data.edges));
    }
    loadGraph();
  }, []);

  async function runTask() {
    if (!task || loading) return;
    setLoading(true);
    try {
      await fetch(`${ENV.API_BASE_URL}/ai-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      setTask("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleApproval(approved: boolean) {
    if (!approval) return;

    try {
      await fetch(`${ENV.API_BASE_URL}/approval`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: approval.approvalId,

          approved,
        }),
      });

      setApproval(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="fixed inset-0 h-screen w-screen bg-[#050505] text-zinc-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* MOBILE HEADER & NAVIGATION TABS */}
      <header className="shrink-0 border-b border-zinc-800/50 p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 backdrop-blur-md z-20">
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              AI Software Team
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] md:text-[9px] uppercase font-mono tracking-widest text-zinc-400">
              Engine Online
            </span>
          </div>
        </div>

        {/* Dynamic Responsive Tab Controls */}
        <div className="flex lg:hidden w-full bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => {
              router.push("?tab=graph");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "graph"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Network className="w-4 h-4" />
            Graph
          </button>
          <button
            onClick={() => {
              router.push("?tab=terminal");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "terminal"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </button>
          <button
            onClick={() => {
              router.push("?tab=diff");
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "diff"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Diff
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE VIEW */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* LEFT PANEL: WORKFLOW GRAPH */}
        <section
          className={`flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(6,182,212,0.02),transparent)] ${
            activeTab === "graph" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="flex-1 relative min-h-0">
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background
                variant={BackgroundVariant.Lines}
                color="#111"
                gap={30}
                size={1}
              />
              <Controls className="!bg-zinc-900 !border-zinc-800 !fill-zinc-400" />
            </ReactFlow>
          </div>

          {/* Bottom Execution Area */}
          <div className="shrink-0 p-4 md:p-6 bg-gradient-to-t from-black to-transparent">
            <div className="max-w-2xl mx-auto relative group">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    runTask();
                  }
                }}
                placeholder="What should the team build next?"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 pr-24 md:pr-32 min-h-[60px] md:min-h-[70px] focus:outline-none focus:border-cyan-500/40 transition-all resize-none shadow-2xl text-xs md:text-sm"
              />
              <button
                onClick={runTask}
                disabled={loading || !task}
                className="absolute right-2 bottom-2 flex items-center gap-2 bg-white text-black px-3 py-2 md:px-5 md:py-2.5 rounded-xl font-bold hover:bg-cyan-400 transition-all disabled:opacity-30"
              >
                {loading ? (
                  <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
                <span className="text-[9px] md:text-[10px] tracking-tighter uppercase">
                  {loading ? "Working" : "Execute"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* MIDDLE PANEL: TERMINAL LOGS */}
        <aside
          className={`w-full lg:w-[380px] xl:w-[420px] shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800/50 bg-[#080808] flex flex-col shadow-2xl overflow-hidden ${
            activeTab === "terminal" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="shrink-0 p-4 border-b border-zinc-800/50 flex items-center gap-2 bg-zinc-900/10">
            <TerminalIcon className="w-4 h-4 text-zinc-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Live Runtime
            </h2>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 font-mono text-[11px] md:text-[12px] custom-scrollbar"
          >
            {logs.map((log, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-right-2 duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                      log.type === "error"
                        ? "text-red-400 border-red-500/20"
                        : "text-cyan-400 border-cyan-500/20"
                    }`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-zinc-600 italic font-sans">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-3 border-l border-zinc-800 markdown-content overflow-hidden break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => (
                        <p
                          className="mb-2 last:mb-0 leading-relaxed text-zinc-400 whitespace-pre-wrap break-all"
                          {...props}
                        />
                      ),
                      strong: ({ ...props }) => (
                        <strong
                          className="text-cyan-400 font-semibold"
                          {...props}
                        />
                      ),
                      code: ({ ...props }) => (
                        <code
                          className="bg-zinc-800 px-1 rounded text-pink-400 break-all whitespace-pre-wrap"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {log.message}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL: MST GIT DIFF VIEW */}
        <aside
          className={`w-full lg:w-[480px] xl:w-[550px] shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800/50 bg-[#050505] flex flex-col shadow-2xl overflow-hidden min-w-0 ${
            activeTab === "diff" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="shrink-0 p-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/10">
            <div className="flex items-center gap-2 text-emerald-500/80">
              <GitBranch className="w-4 h-4" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Live Git Diff
              </h2>
            </div>
            {diff && (
              <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Changes Detected
              </span>
            )}
          </div>

          <div className="flex-1 overflow-hidden bg-[#030303] relative min-h-0 w-full">
            {diff ? (
              <div className="absolute inset-0 w-full h-full">
                <DiffEditor
                  height="100%"
                  width="100%"
                  language="typescript"
                  theme="vs-dark"
                  original={""}
                  modified={diff}
                  options={{
                    renderSideBySide: false,
                    readOnly: true,
                    domReadOnly: true,
                    fontSize: 11,
                    minimap: { enabled: false },
                    scrollbar: {
                      verticalSliderSize: 1,
                      horizontalSliderSize: 5,
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] opacity-20 italic p-6">
                <Maximize2 className="w-8 h-8 mb-4" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-center">
                  Waiting for code changes
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #18181b;
          border-radius: 10px;
        }
        .markdown-content p {
          margin-bottom: 0.5rem;
        }
        .react-flow__handle {
          background: #22d3ee !important;
          border: 1px solid #050505 !important;
          width: 6px !important;
          height: 6px !important;
        }
        .react-flow__controls {
          box-shadow: none !important;
          border: 1px solid #27272a !important;
        }
      `}</style>

      {/* SYSTEM APPROVAL OVERLAY */}
      {approval && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] bg-zinc-900 border border-red-500/20 rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl md:text-2xl font-bold text-red-400">
              Approval Required
            </h2>

            <p className="mt-4 text-xs md:text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {approval.message}
            </p>

            <div className="mt-8 flex flex-row justify-end gap-3 md:gap-4">
              <button
                onClick={() => handleApproval(false)}
                className="flex-1 md:flex-none px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Reject
              </button>

              <button
                onClick={() => handleApproval(true)}
                className="flex-1 md:flex-none px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm rounded-xl bg-red-500 text-white hover:bg-red-400 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// 2. Wrap the sub-component with Suspense for static prerendering
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#050505] text-zinc-400">
          <Activity className="w-6 h-6 animate-spin text-cyan-400 mr-2" />
          <span className="text-sm font-mono tracking-widest uppercase">
            Loading workspace...
          </span>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
