import type { Edge, Node } from "reactflow";

export const initialNodes: Node[] = [
  {
    id: "planner",

    position: {
      x: 100,
      y: 50,
    },

    data: {
      label: "Planner",
    },

    type: "default",
  },

  {
    id: "searcher",

    position: {
      x: 100,
      y: 180,
    },

    data: {
      label: "Searcher",
    },

    type: "default",
  },

  {
    id: "backend-engineer",

    position: {
      x: 100,
      y: 310,
    },

    data: {
      label: "Backend Engineer",
    },

    type: "default",
  },

  {
    id: "reviewer",

    position: {
      x: 100,
      y: 440,
    },

    data: {
      label: "Reviewer",
    },

    type: "default",
  },

  {
    id: "validator",

    position: {
      x: 100,
      y: 570,
    },

    data: {
      label: "Validator",
    },

    type: "default",
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1",

    source: "planner",

    target: "searcher",
  },

  {
    id: "e2",

    source: "searcher",

    target: "backend-engineer",
  },

  {
    id: "e3",

    source: "backend-engineer",

    target: "reviewer",
  },

  {
    id: "e4",

    source: "reviewer",

    target: "validator",
  },
];
