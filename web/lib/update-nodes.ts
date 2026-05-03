import type { Node } from "reactflow";

export function updateNodes(nodes: Node[], activeAgent?: string) {
  return nodes.map((node) => {
    const isActive = node.id === activeAgent;

    return {
      ...node,

      style: {
        background: isActive ? "#2563eb" : "#18181b",

        color: "white",

        border: isActive ? "2px solid #60a5fa" : "1px solid #3f3f46",

        borderRadius: "12px",

        padding: "10px",

        width: 180,

        boxShadow: isActive ? "0 0 20px rgba(59,130,246,0.8)" : "none",
      },
    };
  });
}
