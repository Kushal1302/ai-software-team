export const graphNodes = [
  {
    id: "intent-classifier",
    label: "Intent Classifier",
  },

  {
    id: "planner",
    label: "Strategic Planner",
  },

  {
    id: "searcher",
    label: "Knowledge Searcher",
  },

  {
    id: "classifier",
    label: "Task Classifier",
  },

  {
    id: "backend-engineer",

    label: "Backend Architect",
  },

  {
    id: "frontend-engineer",

    label: "Frontend Architect",
  },

  {
    id: "reviewer",
    label: "Code Reviewer",
  },

  {
    id: "validator",
    label: "Final Validator",
  },

  {
    id: "answer-agent",

    label: "Answer Agent",
  },

  {
    id: "change-summary",

    label: "Change Summary",
  },
];

export const graphEdges = [
  {
    source: "intent-classifier",

    target: "planner",
  },

  {
    source: "intent-classifier",

    target: "answer-agent",
  },

  {
    source: "intent-classifier",

    target: "change-summary",
  },

  {
    source: "planner",

    target: "searcher",
  },

  {
    source: "searcher",

    target: "classifier",
  },

  {
    source: "classifier",

    target: "backend-engineer",
  },

  {
    source: "classifier",

    target: "frontend-engineer",
  },

  {
    source: "backend-engineer",

    target: "reviewer",
  },

  {
    source: "frontend-engineer",

    target: "reviewer",
  },

  {
    source: "reviewer",

    target: "validator",
  },

  {
    source: "validator",

    target: "change-summary",
  },
];
