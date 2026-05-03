"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Send, Cpu, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css"; // Basic styles must be imported
import { RuntimeEvent } from "@/types/runtime";
import { buildEdges, buildNodes } from "@/lib/build.graph";

// --- Workflow Config ---
export const initialNodes: Node[] = [
  {
    id: "planner",
    position: { x: 250, y: 0 },
    data: { label: "Strategic Planner" },
    type: "default",
  },
  {
    id: "searcher",
    position: { x: 250, y: 100 },
    data: { label: "Knowledge Searcher" },
    type: "default",
  },
  {
    id: "backend-engineer",
    position: { x: 250, y: 200 },
    data: { label: "Backend Architect" },
    type: "default",
  },
  {
    id: "reviewer",
    position: { x: 250, y: 300 },
    data: { label: "Code Reviewer" },
    type: "default",
  },
  {
    id: "validator",
    position: { x: 250, y: 400 },
    data: { label: "Final Validator" },
    type: "default",
  },
  {
    id: "intent-classifier",
    position: { x: 250, y: 500 },
    data: { label: "Intent Classifier" },
    type: "default",
  },
  {
    id: "answer-agent",
    position: { x: 250, y: 600 },
    data: { label: "Answer Agent" },
    type: "default",
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "planner",
    target: "searcher",
    animated: true,
    style: { stroke: "#22d3ee" },
  },
  {
    id: "e2",
    source: "searcher",
    target: "backend-engineer",
    animated: true,
    style: { stroke: "#22d3ee" },
  },
  {
    id: "e3",
    source: "backend-engineer",
    target: "reviewer",
    animated: true,
    style: { stroke: "#22d3ee" },
  },
  {
    id: "e4",
    source: "reviewer",
    target: "validator",
    animated: true,
    style: { stroke: "#22d3ee" },
  },
  {
    id: "e5",
    source: "validator",
    target: "end",
    animated: true,
    style: { stroke: "#22d3ee" },
  },
  {
    id: "e6",
    source: "intent-classifier",
    target: "answer-agent",
    animated: true,
    style: { stroke: "#22d3ee" },
  },
];

export function updateNodes(nodes: Node[], activeAgent?: string): Node[] {
  return nodes.map((node) => {
    const isActive = node.id === activeAgent;
    return {
      ...node,
      style: {
        background: isActive
          ? "rgba(6, 182, 212, 0.2)"
          : "rgba(24, 24, 27, 0.8)",
        color: isActive ? "#fff" : "#a1a1aa",
        border: isActive ? "1px solid #22d3ee" : "1px solid #3f3f46",
        borderRadius: "12px",
        padding: "12px",
        width: 200,
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
        boxShadow: isActive ? "0 0 25px rgba(6, 182, 212, 0.4)" : "none",
        backdropFilter: "blur(4px)",
        transition: "all 0.5s ease",
      },
    };
  });
}

// --- Main Component ---
export default function HomePage() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<RuntimeEvent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>();
  const [baseNodes, setBaseNodes] = useState<Node[]>([]);
  const [diff, setDiff] = useState("");

  const [edges, setEdges] = useState<Edge[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nodes: Node[] = useMemo(
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
    const eventSource = new EventSource("http://localhost:3001/events");
    eventSource.addEventListener("runtime-event", (event) => {
      const data = JSON.parse(event.data);
      setLogs((prev) => [...prev, data]);

      if (data.type === "agent") {
        console.log("Active Agent:", data.agentId);
        setActiveAgent(data.agentId);
      }

      if (data.type === "diff") {
        setDiff(data.message);
      }
    });
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    async function loadGraph() {
      const response = await fetch("http://localhost:3001/graph");

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
      await fetch("http://localhost:3001/ai-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      setTask("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fixed inset-0 bg-[#050505] text-zinc-300 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <div className="flex h-full w-full">
        {/* LEFT PANEL: GRAPH VIEW */}
        <section className="flex-1 flex flex-col min-w-0">
          <header className="shrink-0 border-b border-zinc-800/50 p-6 flex items-center justify-between bg-black/40 backdrop-blur-xl z-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                  AI Software Team
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/60 font-bold">
                  Autonomous Engine
                </p>
              </div>
            </div>
          </header>

          <div className="flex-1 relative bg-[#080808]">
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background
                variant={BackgroundVariant.Lines}
                color="#111"
                gap={25}
                size={1}
              />

              <Controls />
            </ReactFlow>

            {/* Overlay Gradient for more depth */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05),transparent)]" />
          </div>

          {/* INPUT AREA */}
          <div className="shrink-0 p-6 bg-black/50 backdrop-blur-md">
            <div className="max-w-4xl mx-auto relative group">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Instruct the AI Team..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 pr-36 min-h-[80px] focus:outline-none focus:border-cyan-500/40 transition-all resize-none shadow-2xl text-sm"
              />
              <button
                onClick={runTask}
                disabled={loading || !task}
                className="absolute right-3 bottom-3 flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-all disabled:opacity-30"
              >
                {loading ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="text-xs">
                  {loading ? "PROCESSING" : "EXECUTE"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: TERMINAL */}
        <aside className="w-[500px] border-l border-zinc-800/50 bg-[#080808] flex flex-col relative z-30 shadow-2xl">
          <div className="shrink-0 p-5 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Live Runtime Logs
              </h2>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 font-mono text-[13px] custom-scrollbar"
          >
            {logs.map((log, index) => (
              <div
                key={index}
                className="animate-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-center justify-between mb-2 opacity-50">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${log.type === "error" ? "text-red-400 border-red-500/20 bg-red-500/5" : "text-cyan-400 border-cyan-500/20 bg-cyan-500/5"}`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-[9px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-3 border-l border-zinc-800 markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => (
                        <p
                          className="mb-2 last:mb-0 leading-relaxed text-zinc-300"
                          {...props}
                        />
                      ),
                      ul: ({ ...props }) => (
                        <ul
                          className="list-disc ml-4 mb-2 space-y-1 text-zinc-400"
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

          <div className="shrink-0 p-4 border-t border-zinc-800/50 bg-black/60">
            <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono uppercase">
              <span>Core: 12%</span>
              <span className="text-emerald-900 animate-pulse font-bold italic tracking-tighter">
                ● Online
              </span>
            </div>
          </div>
        </aside>
        
        {/* DIFF PANEL */}
        <aside className="w-[600px] border-l border-zinc-800/50 bg-[#080808] flex flex-col">
          {/* HEADER */}
          <div className="shrink-0 p-5 border-b border-zinc-800/50 bg-zinc-900/20">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Live Git Diff
            </h2>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-auto p-5">
            <pre className="text-sm whitespace-pre-wrap font-mono text-zinc-300">
              {diff || "No diff available"}
            </pre>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #18181b;
          border-radius: 10px;
        }
        .react-flow__handle {
          background: #22d3ee !important;
          border: 2px solid #050505 !important;
          width: 8px !important;
          height: 8px !important;
        }
        .react-flow__controls-button {
          background: #18181b !important;
          border-bottom: 1px solid #333 !important;
          fill: #666 !important;
        }
        .react-flow__controls-button:hover {
          background: #222 !important;
        }
        .react-flow__edge-path {
          stroke-width: 2;
        }
      `}</style>
    </main>
  );
}
