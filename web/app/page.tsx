"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Send,
  Cpu,
  Activity,
  GitBranch,
  Terminal as TerminalIcon,
  Maximize2,
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

export default function HomePage() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<RuntimeEvent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>();
  const [baseNodes, setBaseNodes] = useState<Node[]>([]);
  const [diff, setDiff] = useState("");
  const [edges, setEdges] = useState<Edge[]>([]);
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

  return (
    <main className="fixed inset-0 bg-[#050505] text-zinc-300 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <div className="flex h-full w-full">
        {/* LEFT PANEL: WORKFLOW GRAPH (Flexible width) */}
        <section className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(6,182,212,0.02),transparent)]">
          <header className="shrink-0 border-b border-zinc-800/50 p-5 flex items-center justify-between bg-black/40 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                AI Software Team
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400">
                Engine Online
              </span>
            </div>
          </header>

          <div className="flex-1 relative">
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

          <div className="shrink-0 p-6 bg-gradient-to-t from-black to-transparent">
            <div className="max-w-2xl mx-auto relative group">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What should the team build next?"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 pr-32 min-h-[70px] focus:outline-none focus:border-cyan-500/40 transition-all resize-none shadow-2xl text-sm"
              />
              <button
                onClick={runTask}
                disabled={loading || !task}
                className="absolute right-2 bottom-2 flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-400 transition-all disabled:opacity-30"
              >
                {loading ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="text-[10px] tracking-tighter uppercase">
                  {loading ? "Working" : "Execute"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* MIDDLE PANEL: TERMINAL LOGS */}
        <aside className="w-[420px] border-l border-zinc-800/50 bg-[#080808] flex flex-col shadow-2xl">
          <div className="shrink-0 p-5 border-b border-zinc-800/50 flex items-center gap-2 bg-zinc-900/10">
            <TerminalIcon className="w-4 h-4 text-zinc-500" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Live Runtime
            </h2>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 font-mono text-[12px] custom-scrollbar"
          >
            {logs.map((log, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-right-2 duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${log.type === "error" ? "text-red-400 border-red-500/20" : "text-cyan-400 border-cyan-500/20"}`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-[9px] text-zinc-600 italic font-sans">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-3 border-l border-zinc-800 markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => (
                        <p
                          className="mb-2 last:mb-0 leading-relaxed text-zinc-400"
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
                          className="bg-zinc-800 px-1 rounded text-pink-400"
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
        <aside className="w-[550px] border-l border-zinc-800/50 bg-[#050505] flex flex-col shadow-2xl">
          <div className="shrink-0 p-5 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/10">
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

          <div className="flex-1 overflow-auto bg-[#030303] custom-scrollbar">
            {diff ? (
              <DiffEditor
                height="100%"
                language="typescript" // You can dynamically change this based on file extension
                theme="vs-dark"
                original={""} // If backend sends only the diff, original can be empty or the old file content
                modified={diff}
                options={{
                  renderSideBySide: false, // Set 'true' for side-by-side view
                  readOnly: true,
                  domReadOnly: true,
                  fontSize: 12,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  scrollbar: { verticalSliderSize: 1, horizontalSliderSize: 5 },
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] opacity-20 italic">
                <Maximize2 className="w-8 h-8 mb-4" />
                <p className="text-[10px] uppercase tracking-[0.3em]">
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
    </main>
  );
}
