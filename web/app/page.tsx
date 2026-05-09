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
  GitBranch,
  Zap,
  Eye,
  Shield,
  Code2,
  ArrowDown,
} from "lucide-react";

// ─── Window Chrome ─────────────────────────────────────────────────────────
const Win = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl overflow-hidden flex flex-col h-full ${className}`}
    style={{
      background: "#111111",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    }}
  >
    <div
      className="h-10 flex items-center px-4 shrink-0 relative"
      style={{
        background: "rgba(255,255,255,0.025)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex gap-[6px] z-10">
        <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2" style={{ opacity: 0.35 }}>
          <Icon size={11} />
          <span
            style={{
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em",
              color: "#aaa",
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
    <div className="p-5 flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#222 transparent" }}>
      {children}
    </div>
  </div>
);

// ─── Section Label ──────────────────────────────────────────────────────────
const SL = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-4">
    <span
      style={{
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#3a3a3a",
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
  </div>
);

// ─── Code Block ─────────────────────────────────────────────────────────────
const CB = ({ children }: { children: React.ReactNode }) => (
  <div
    className="rounded-xl p-4 text-xs leading-7 overflow-x-auto"
    style={{
      background: "#0C0C0C",
      border: "1px solid rgba(255,255,255,0.04)",
      fontFamily: "'JetBrains Mono', monospace",
    }}
  >
    {children}
  </div>
);

// ─── Badge ──────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "#00FFC6" }: { children: React.ReactNode; color?: string }) => (
  <span
    className="inline-block px-2 py-0.5 rounded-md text-[10px]"
    style={{
      background: `${color}10`,
      border: `1px solid ${color}22`,
      color,
      fontFamily: "'JetBrains Mono', monospace",
    }}
  >
    {children}
  </span>
);

// ─── Pipeline Step ──────────────────────────────────────────────────────────
const FlowStep = ({ num, label, delay = 0 }: { num: number; label: string; delay?: number }) => (
  <div
    className="flex items-center gap-3 py-2"
    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
  >
    <div
      className="flex items-center justify-center rounded-full shrink-0 text-[9px] font-bold"
      style={{
        width: 22,
        height: 22,
        background: "rgba(0,255,198,0.07)",
        border: "1px solid rgba(0,255,198,0.2)",
        color: "#00FFC6",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {num}
    </div>
    <span
      style={{
        fontSize: 11,
        color: "#777",
        fontFamily: "'JetBrains Mono', monospace",
        flex: 1,
      }}
    >
      {label}
    </span>
    <div
      className="rounded-full overflow-hidden"
      style={{ width: 48, height: 3, background: "rgba(255,255,255,0.04)" }}
    >
      <div
        style={{
          height: "100%",
          background: "linear-gradient(90deg,#00FFC6,#7B5CFA)",
          borderRadius: 99,
          animation: `flowBar 2.5s ease-in-out ${delay}s infinite`,
        }}
      />
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <main
      className="min-h-screen text-zinc-300 p-6 md:p-10 lg:p-14"
      style={{ background: "#0A0A0A", fontFamily: "'JetBrains Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes flowBar{0%{width:0%;opacity:0}45%{width:100%;opacity:1}100%{width:100%;opacity:.12}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.65)}}
        @keyframes glowFade{0%,100%{opacity:.5}50%{opacity:1}}
        .live-dot{width:6px;height:6px;border-radius:50%;background:#00FFC6;animation:livePulse 1.6s ease-in-out infinite;display:inline-block}
        .glow-div{height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,198,.2),rgba(123,92,250,.35),rgba(0,255,198,.2),transparent);animation:glowFade 3s ease-in-out infinite}
        .agent-chip{transition:all .18s;cursor:default}
        .agent-chip:hover{border-color:rgba(123,92,250,.45)!important;color:#7B5CFA!important;background:rgba(123,92,250,.05)!important}
        .cta-btn{transition:all .2s;cursor:pointer}
        .cta-btn:hover{background:#00FFC6!important;color:#000!important}
        .topic-tag{transition:all .18s}
        .topic-tag:hover{border-color:rgba(0,255,198,.3)!important;color:#00FFC6!important}
      `}</style>

      <div className="max-w-6xl mx-auto space-y-7">

        {/* ── HERO ── */}
        <section className="flex flex-col items-center text-center pt-10 pb-4">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full mb-7 text-[10px] tracking-[.2em] uppercase"
            style={{
              background: "rgba(0,255,198,.05)",
              border: "1px solid rgba(0,255,198,.15)",
              color: "#00FFC6",
            }}
          >
            <span className="live-dot" />
            Runtime Active · TypeScript 95.4%
          </div>

          <h1
            className="font-bold text-white leading-none tracking-tighter mb-4"
            style={{ fontSize: "clamp(2.8rem,8vw,5.2rem)" }}
          >
            AI Software
            <br />
            <span style={{ color: "#00FFC6" }}>Team</span>
          </h1>

          <p
            style={{
              fontSize: 11,
              color: "#555",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Autonomous multi-agent engineering runtime · LangGraph · TypeScript · Hono
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {[
              "multi-agent","langgraph","langchain","agentic-ai","tool-calling",
              "reactflow","streaming","sse","hono","nextjs","typescript","llm",
              "ai-runtime","ai-engineering",
            ].map((t) => (
              <span
                key={t}
                className="topic-tag px-2.5 py-1 rounded-md text-[10px]"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,.06)", color: "#555" }}
              >
                #{t}
              </span>
            ))}
          </div>
        </section>

        <div className="glow-div" />

        {/* ── ROW 1: Intro + Runtime Flow ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <Win title="README.md" icon={FolderIcon}>
              <SL>About</SL>
              <p style={{ fontSize: 12, color: "#888", lineHeight: 1.9, marginBottom: "1.5rem" }}>
                Simulates a real AI engineering organization where specialized agents collaborate
                to analyze repositories, retrieve code context, modify implementations, validate
                changes, and stream runtime activity live to the UI.
              </p>
              <SL>Key concepts</SL>
              <div className="flex flex-wrap gap-2">
                {[
                  ["Multi-Agent Systems","#00FFC6"],["Tool Calling","#7B5CFA"],
                  ["Semantic Memory","#FFD700"],["Runtime Streaming","#FF4D6D"],
                  ["Event-Driven Arch","#60A5FA"],["Autonomous Loops","#00FFC6"],
                  ["Human-in-the-loop","#7B5CFA"],["Vector Retrieval","#FFD700"],
                  ["Repo Intelligence","#FF4D6D"],["AI Workflow Orch.","#60A5FA"],
                ].map(([label, color]) => (
                  <Badge key={label} color={color}>{label}</Badge>
                ))}
              </div>
            </Win>
          </div>

          <div className="lg:col-span-5">
            <Win title="runtime-pipeline.ts" icon={Network}>
              <SL>Execution flow</SL>
              {[
                "User Task","Intent Classifier","Strategic Planner",
                "Repository Searcher","Task Classifier","Frontend / Backend Eng.",
                "Reviewer","Validator","Change Summary",
              ].map((step, i) => (
                <FlowStep key={step} num={i + 1} label={step} delay={i * 0.28} />
              ))}
            </Win>
          </div>
        </div>

        {/* ── ROW 2: Agents + Graph ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Win title="agents.config.ts" icon={Cpu}>
            <SL>Active agents · 10 online</SL>
            <div className="flex flex-wrap gap-2">
              {[
                "Intent Classifier","Strategic Planner","Repository Searcher",
                "Task Classifier","Backend Engineer","Frontend Engineer",
                "Reviewer","Validator","Change Summary Agent","Answer Agent",
              ].map((agent) => (
                <span
                  key={agent}
                  className="agent-chip px-3 py-1.5 rounded-lg text-[10px]"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(123,92,250,.12)",
                    color: "#666",
                  }}
                >
                  {agent}
                </span>
              ))}
            </div>
          </Win>

          <Win title="graph-architecture.ts" icon={GitBranch}>
            <SL>LangGraph StateGraph</SL>
            <CB>
              <div style={{ color: "#555" }}>START</div>
              <div className="flex justify-center my-0.5"><ArrowDown size={10} style={{ color: "#333" }} /></div>
              <div style={{ color: "#00FFC6" }}>intent-classifier</div>
              <div className="flex justify-center my-0.5"><ArrowDown size={10} style={{ color: "#333" }} /></div>
              <div style={{ color: "#00FFC6" }}>planner → searcher → classifier</div>
              <div className="ml-4 my-1 space-y-0.5">
                <div><span style={{ color: "#444" }}>├──</span> <span style={{ color: "#7B5CFA" }}>backend-engineer</span></div>
                <div><span style={{ color: "#444" }}>└──</span> <span style={{ color: "#7B5CFA" }}>frontend-engineer</span></div>
              </div>
              <div className="flex justify-center my-0.5"><ArrowDown size={10} style={{ color: "#333" }} /></div>
              <div style={{ color: "#00FFC6" }}>reviewer → validator → change-summary</div>
              <div className="flex justify-center my-0.5"><ArrowDown size={10} style={{ color: "#333" }} /></div>
              <div style={{ color: "#555" }}>END</div>
            </CB>
            <p className="mt-3" style={{ fontSize: 11, color: "#555" }}>
              Routing via{" "}
              <code style={{ color: "#7B5CFA", fontSize: 10 }}>
                .addConditionalEdges("classifier", taskRouter)
              </code>
              {" "}— dynamically determined by agent reasoning + runtime state.
            </p>
          </Win>
        </div>

        {/* ── ROW 3: Memory + Events + Tools ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Win title="memory-system.ts" icon={Brain}>
            <SL>Memory architecture</SL>
            <div className="space-y-2 mb-4">
              {[
                { icon: "⬇", label: "Extraction", color: "#00FFC6" },
                { icon: "⎔", label: "Embedding generation", color: "#7B5CFA" },
                { icon: "◈", label: "Vector storage", color: "#FFD700" },
                { icon: "⌕", label: "Semantic retrieval", color: "#FF4D6D" },
                { icon: "↯", label: "Memory injection", color: "#60A5FA" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 p-2.5 rounded-lg"
                  style={{ background: "#0D0D0D" }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: 26,
                      height: 26,
                      background: `${s.color}10`,
                      color: s.color,
                      fontSize: 13,
                    }}
                  >
                    {s.icon}
                  </div>
                  <span style={{ fontSize: 11, color: "#777" }}>{s.label}</span>
                </div>
              ))}
            </div>
            <div
              className="rounded-lg p-3 text-[10px] leading-relaxed"
              style={{ background: "#0D0D0D", color: "#555" }}
            >
              Learns: repo architecture · implementation locations · framework conventions · recurring failures · engineering patterns
            </div>
          </Win>

          <Win title="events.ts" icon={Activity}>
            <SL>Runtime events (SSE)</SL>
            <CB>
              <div>
                <span style={{ color: "#7B5CFA" }}>type</span>{" "}
                <span style={{ color: "#fff" }}>RuntimeEvent</span> =
              </div>
              {['"agent"','"tool"','"terminal"','"diff"','"approval"','"log"'].map((e) => (
                <div key={e}>
                  &nbsp;&nbsp;|&nbsp;<span style={{ color: "#00FFC6" }}>{e}</span>
                </div>
              ))}
            </CB>
            <div className="mt-4 space-y-2">
              <p style={{ fontSize: 9, color: "#3a3a3a", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Powers
              </p>
              {["live logs","graph visualization","terminal streaming","diff viewer","approval modals"].map((f) => (
                <div key={f} className="flex items-center gap-2" style={{ fontSize: 11, color: "#666" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00FFC6", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          </Win>

          <Win title="tools.json" icon={Wrench}>
            <SL>Tool system</SL>
            <div className="space-y-3">
              {[
                { cat: "Repository Intelligence", icon: "⌕", color: "#00FFC6", items: ["search_code","read_file","grep / search_text"] },
                { cat: "Engineering", icon: "⚙", color: "#7B5CFA", items: ["patch_file","git_diff","run_terminal"] },
                { cat: "Validation", icon: "✓", color: "#FFD700", items: ["npm run build","npm run typecheck","lint / test execution"] },
              ].map((t) => (
                <div
                  key={t.cat}
                  className="rounded-xl p-3"
                  style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.04)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: t.color, fontSize: 12 }}>{t.icon}</span>
                    <span style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {t.cat}
                    </span>
                  </div>
                  {t.items.map((item) => (
                    <div key={item} style={{ fontSize: 10, color: t.color, fontFamily: "'JetBrains Mono',monospace", marginBottom: 2 }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Win>
        </div>

        {/* ── ROW 4: Tech Stack + Project Structure ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Win title="tech-stack.yml" icon={Database}>
            <SL>Technology</SL>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Backend", color: "#7B5CFA", items: ["TypeScript","LangGraph","LangChain","Hono","Node.js"] },
                { label: "Frontend", color: "#00FFC6", items: ["Next.js","React","Tailwind CSS","ReactFlow"] },
                { label: "AI / Runtime", color: "#FFD700", items: ["Gemini","Tool Calling","Event Streaming","Multi-Agent Orch."] },
                { label: "Memory", color: "#FF4D6D", items: ["ChromaDB","Vector Embeddings"] },
              ].map((col) => (
                <div key={col.label}>
                  <p style={{ fontSize: 9, color: "#3a3a3a", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
                    {col.label}
                  </p>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-2" style={{ fontSize: 11, color: "#777" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: col.color, flexShrink: 0, display: "inline-block" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Win>

          <Win title="project-structure.ts" icon={Code2}>
            <SL>Source layout</SL>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={{ fontSize: 9, color: "#3a3a3a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                  server/src/
                </p>
                <CB>
                  {["agents/","graph/","tools/","events/","runtime/","memory/","prompts/","server.ts","index.ts"].map((f) => (
                    <div key={f} style={{ color: f.endsWith("/") ? "#7B5CFA" : "#00FFC6" }}>├── {f}</div>
                  ))}
                </CB>
              </div>
              <div>
                <p style={{ fontSize: 9, color: "#3a3a3a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
                  web/
                </p>
                <CB>
                  {["/app","/components","/lib","/types"].map((f) => (
                    <div key={f} style={{ color: "#00FFC6" }}>├── {f}</div>
                  ))}
                </CB>
              </div>
            </div>
          </Win>
        </div>

        {/* ── ROW 5: Setup + Tasks ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Win title="setup.zsh" icon={TerminalIcon}>
              <SL>Getting started</SL>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { prompt: "$ install dependencies", cmd: "npm install", color: "#555" },
                  { prompt: "$ run chromadb", cmd: "docker run -p 8000:8000 chromadb/chroma", color: "#555" },
                  { prompt: "$ start backend", cmd: "npm run dev", color: "#00FFC6" },
                  { prompt: "$ start frontend", cmd: "cd web && npm install && npm run dev", color: "#00FFC6" },
                ].map((item) => (
                  <div
                    key={item.prompt}
                    className="rounded-xl p-3"
                    style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div style={{ fontSize: 9, color: item.color, letterSpacing: "0.12em", marginBottom: 6 }}>
                      {item.prompt}
                    </div>
                    <code style={{ fontSize: 11, color: "#fff", wordBreak: "break-all", fontFamily: "'JetBrains Mono',monospace" }}>
                      {item.cmd}
                    </code>
                  </div>
                ))}
              </div>
            </Win>
          </div>

          <Win title="tasks.txt" icon={Flame}>
            <SL>Example prompts</SL>
            <div className="space-y-2">
              {[
                "Add auth request logging",
                "Fix Prisma validation issue",
                "Implement dark mode toggle",
                "Add Redis caching layer",
                "Refactor middleware architecture",
              ].map((task) => (
                <div
                  key={task}
                  className="flex items-start gap-3 p-3 rounded-xl text-[11px]"
                  style={{ background: "#0D0D0D", color: "#777" }}
                >
                  <span style={{ color: "#00FFC6", flexShrink: 0 }}>$</span>
                  {task}
                </div>
              ))}
            </div>
          </Win>
        </div>

        {/* ── ROW 6: Approval Gates + Features + Visualization ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Win title="approval-gates.ts" icon={Shield}>
            <SL>Human approval gates</SL>
            <div
              className="flex gap-3 p-3.5 rounded-xl text-[11px] leading-relaxed mb-4"
              style={{
                background: "rgba(255,77,109,.04)",
                border: "1px solid rgba(255,77,109,.15)",
                color: "#888",
              }}
            >
              <AlertTriangle size={16} style={{ color: "#FF4D6D", flexShrink: 0, marginTop: 1 }} />
              Dangerous operations pause until user approval is confirmed.
            </div>
            <div className="space-y-2">
              {["rm commands","git push","migrations","docker operations"].map((op) => (
                <div key={op} className="flex items-center gap-2 text-[11px]" style={{ color: "#666" }}>
                  <span style={{ color: "#FF4D6D" }}>⚠</span> {op}
                </div>
              ))}
            </div>
          </Win>

          <Win title="streaming.md" icon={Zap}>
            <SL>Real-time runtime</SL>
            <div className="space-y-2 mb-4">
              {[
                ["Server-Sent Events (SSE)","#00FFC6"],
                ["Event-driven architecture","#7B5CFA"],
                ["Streaming terminal logs","#00FFC6"],
                ["Streaming tool execution","#7B5CFA"],
                ["Live workflow updates","#00FFC6"],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-2 text-[11px]" style={{ color: "#777" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {label}
                </div>
              ))}
            </div>
            <SL>LangGraph features</SL>
            <div className="space-y-1">
              {["Conditional routing","Autonomous loops","Checkpointing","Agent handoffs","Dynamic execution flows"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-[11px]" style={{ color: "#666" }}>
                  <span style={{ color: "#7B5CFA", fontSize: 9 }}>◆</span> {f}
                </div>
              ))}
            </div>
          </Win>

          <Win title="visualization.md" icon={Eye}>
            <SL>ReactFlow graph</SL>
            <div className="space-y-2">
              {[
                "Active agent highlighting",
                "Real-time execution tracking",
                "Dynamic graph rendering",
                "Orchestration visibility",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-[11px]" style={{ color: "#777" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#60A5FA", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          </Win>
        </div>

        {/* ── ROW 7: Future + Goals ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Win title="future.log" icon={Target}>
            <SL>Roadmap</SL>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                "LangGraph Interrupts","Durable Workflow Resumption",
                "Playwright Browser Agent","AST-safe Code Editing",
                "Multi-Repository Intelligence","Distributed Worker Runtime",
                "Monaco Diff Visualization","Kubernetes Runtime Workers",
                "Autonomous PR Generation",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[11px]" style={{ color: "#666" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF4D6D", flexShrink: 0, marginTop: 4 }} />
                  {item}
                </div>
              ))}
            </div>
          </Win>

          <Win title="goals.md" icon={Rocket}>
            <SL>Project explores</SL>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-5">
              {[
                ["Autonomous SW Engineering","#00FFC6"],
                ["AI Orchestration Systems","#7B5CFA"],
                ["Multi-Agent Collaboration","#00FFC6"],
                ["Repository Intelligence","#FFD700"],
                ["Durable AI Runtimes","#7B5CFA"],
                ["Real-time AI Observability","#60A5FA"],
                ["Semantic Engineering Memory","#FF4D6D"],
              ].map(([label, color]) => (
                <div key={label} className="flex items-start gap-2 text-[11px]" style={{ color: "#777" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: color as string, flexShrink: 0, marginTop: 4 }} />
                  {label}
                </div>
              ))}
            </div>
            <div
              className="flex gap-3 p-3.5 rounded-xl text-[10px] leading-relaxed"
              style={{
                background: "rgba(255,215,0,.03)",
                border: "1px solid rgba(255,215,0,.1)",
                color: "#777",
              }}
            >
              <AlertTriangle size={14} style={{ color: "#FFD700", flexShrink: 0, marginTop: 1 }} />
              Experimental system designed for learning advanced agentic AI architecture.
              Always review AI-generated code before production usage.
            </div>
          </Win>
        </div>

        <div className="glow-div" />

        {/* ── CTA ── */}
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <button
            className="cta-btn flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm"
            style={{
              background: "#fff",
              color: "#000",
              border: "none",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
            }}
            onClick={() => window.open("https://github.com/Kushal1302/ai-software-team", "_blank")}
          >
            <Star size={15} fill="currentColor" />
            Star on GitHub
          </button>
          <p
            style={{
              fontSize: 9,
              color: "#2a2a2a",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
            }}
          >
            End of documentation — Autonomous AI Engineering System
          </p>
        </div>

      </div>
    </main>
  );
}