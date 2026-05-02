# AI Software Engineering Team

A production-style autonomous AI software engineering system built using LangGraph, multi-agent orchestration, semantic repository retrieval, validation loops, and autonomous repair workflows.

This is NOT a simple chatbot.

This project is designed as a mini autonomous software engineering platform inspired by:

- Devin
- Cursor
- OpenHands

---

# Final Product Vision

User says:

```txt
"Add dark mode to dashboard"
```

System executes:

```txt
Manager Agent
   ↓
Planner Agent
   ↓
Research Agent
   ↓
Backend Agent
   ↓
Frontend Agent
   ↓
Reviewer Agent
   ↓
Testing Agent
   ↓
Fix Loop
   ↓
Final Report
```

This is real AI systems engineering.

---

# What We Will Build

# PHASE 1 — Foundation

- Multi-agent graph
- Shared state
- Task delegation
- Repository understanding

---

# PHASE 2 — Coding Infrastructure

- Code search
- Patch editing
- Validation loops
- Git-aware changes

---

# PHASE 3 — Agent Coordination

- Supervisor routing
- Agent memory
- Retries
- Human approvals

---

# PHASE 4 — Production Layer

- Queue system
- Logs
- Metrics
- LangSmith tracing

---

# PHASE 5 — UI

- Real-time workflow visualization
- Agent logs
- Live execution graph

---

# Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js |
| Backend | Node.js |
| AI Runtime | LangGraph |
| Models | Gemini / OpenAI / Groq |
| Database | PostgreSQL |
| Vector DB | ChromaDB |
| Queue | BullMQ |
| Realtime | Socket.IO |
| ORM | Prisma |
| Validation | Zod |
| Observability | LangSmith |

---

# System Architecture

# High Level

```txt
Frontend
   ↓
API Gateway
   ↓
Task Queue
   ↓
Supervisor Agent
   ↓
Specialist Agents
   ├── Planner
   ├── Repo Searcher
   ├── Backend Engineer
   ├── Frontend Engineer
   ├── Reviewer
   ├── Tester
   └── Fixer
```

---

# Agents We’ll Build

# 1. Supervisor Agent

Brain of the system.

Responsibilities:

- Task routing
- Orchestration
- Retries
- Escalation
- Final coordination

---

# 2. Planner Agent

Creates execution plans.

Example:

Task:

```txt
"Add dark mode"
```

Plan:

```txt
1. Find theme provider
2. Add context
3. Update layout
4. Add toggle
5. Persist theme
```

Very important agent.

---

# 3. Repo Search Agent

Uses:

- Vector search
- Semantic retrieval
- Architecture understanding

Finds:

- Relevant files
- Related logic
- Dependencies

---

# 4. Backend Engineer Agent

Works on:

- APIs
- Prisma
- TRPC
- Database logic

---

# 5. Frontend Engineer Agent

Works on:

- React
- Next.js
- Tailwind
- UI updates

---

# 6. Reviewer Agent

Checks:

- Code quality
- Architecture
- Formatting
- Security
- Best practices

---

# 7. Testing Agent

Runs:

```bash
npm run typecheck
npm run lint
npm test
```

Collects failures.

---

# 8. Repair Agent

Analyzes:

- TypeScript errors
- Runtime failures
- Lint errors

Then patches automatically.

---

# Core LangGraph Flow

```txt
START
 ↓
Supervisor
 ↓
Planner
 ↓
Search Agent
 ↓
Engineer Agent
 ↓
Reviewer
 ↓
Tester
 ↓
Errors?
 ↙       ↘
YES       NO
 ↓          ↓
Repair      END
```

This is real autonomous engineering architecture.

---

# Shared State Design

Production systems live/die by good state design.

## state.ts

```ts
export interface AgentState {
  task: string;

  plan?: string;

  relevantFiles?: string[];

  codeChanges?: string[];

  validationResult?: string;

  retryCount?: number;

  completed?: boolean;

  logs?: string[];
}
```

---

# Folder Structure

```txt
src/
 ├── agents/
 │    ├── supervisor.ts
 │    ├── planner.ts
 │    ├── searcher.ts
 │    ├── backend.ts
 │    ├── frontend.ts
 │    ├── reviewer.ts
 │    ├── tester.ts
 │    └── repair.ts
 │
 ├── tools/
 │    ├── read-file.ts
 │    ├── patch-file.ts
 │    ├── search-code.ts
 │    ├── typecheck.ts
 │    └── git-diff.ts
 │
 ├── graph/
 │    ├── workflow.ts
 │    ├── routing.ts
 │    └── state.ts
 │
 ├── vector/
 │    ├── indexer.ts
 │    └── retriever.ts
 │
 ├── prompts/
 │    ├── planner.txt
 │    ├── reviewer.txt
 │    ├── backend.txt
 │    └── frontend.txt
 │
 └── app/
```

This is production-grade structure.

---

# First Thing We Build

Supervisor + Planner + Searcher

Before coding agents.

Why?

Because:

```txt
planning and retrieval quality
matter MORE than generation.
```

---

# UI Vision

# LEFT PANEL

Task input.

---

# CENTER

Live graph visualization:

```txt
Planner ✓
Searcher ✓
Backend Agent ⏳
Reviewer waiting...
```

---

# RIGHT PANEL

Realtime logs:

```txt
[Planner]
Searching auth middleware...

[Searcher]
Found 3 files...

[Backend Agent]
Applying patch...
```

This becomes an insane portfolio project.

---

# Important Reality

Most AI agents fail because of:

- Bad orchestration
- Poor retrieval
- Unsafe editing
- No validation loops

NOT because of models.

---

# What Will Make This System Strong

We’ll implement:

- Planning
- Patch-based editing
- Retries
- Validation loops
- Graph orchestration
- Semantic repository retrieval
- Approval systems

This is serious AI engineering.

---

# Development Roadmap

# WEEK 1

- ✅ Multi-agent graph
- ✅ Shared state
- ✅ Planner + Searcher

---

# WEEK 2

- ✅ Backend/Frontend agents
- ✅ Patch editing
- ✅ Validation loops

---

# WEEK 3

- ✅ Reviewer + Testing agents
- ✅ Autonomous repair loops

---

# WEEK 4

- ✅ UI
- ✅ Realtime logs
- ✅ LangSmith tracing

---

# WEEK 5

- ✅ Queue system
- ✅ Persistent tasks
- ✅ Multi-repo support

---

# Insane Future Upgrades

# 1. Browser Agent

Playwright-powered browser automation.

---

# 2. GitHub PR Agent

Automatically creates pull requests.

---

# 3. Voice Commander

Example:

```txt
"Add dashboard analytics"
```

---

# 4. Docker Sandbox Execution

Safe isolated runtime environment.

---

# 5. VSCode Extension

IDE integration with live agent workflows.

---

# Long-Term Goal

Build a fully autonomous AI software engineering team capable of:

- Understanding repositories
- Planning architecture
- Writing code
- Reviewing changes
- Running validations
- Repairing failures
- Managing long-running engineering workflows

---

# License

MIT

---

# Author

Kushal Kumar