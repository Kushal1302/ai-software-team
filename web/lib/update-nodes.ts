import type { Node } from "reactflow";

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
        width: 180,
        fontSize: "11px",
        fontWeight: "600",
        textAlign: "center",
        boxShadow: isActive ? "0 0 30px rgba(6, 182, 212, 0.3)" : "none",
        backdropFilter: "blur(8px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    };
  });
}
