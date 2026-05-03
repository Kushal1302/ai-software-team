import type { Edge, Node } from "reactflow";

import type { ServerGraphEdge, ServerGraphNode } from "@/types/graph";

export function buildNodes(nodes: ServerGraphNode[]): Node[] {
  return nodes.map((node, index) => ({
    id: node.id,

    position: {
      x: 250,
      y: index * 120,
    },

    data: {
      label: node.label,
    },

    type: "default",
  }));
}

export function buildEdges(edges: ServerGraphEdge[]): Edge[] {
  return edges.map((edge, index) => ({
    id: `e-${index}`,

    source: edge.source,

    target: edge.target,

    animated: true,

    style: {
      stroke: "#22d3ee",
    },
  }));
}
