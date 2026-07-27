import React from 'react';
import { motion } from 'framer-motion';
import { GraphNode, POINode } from '../data/mapData';

type Props = {
  path: (POINode | GraphNode)[];
};

export default function RouteLayer({ path }: Props) {
  if (!path || path.length < 2) return null;

  // Generate SVG path data with rounded corners using quadratic curves
  // To keep it simple, we just draw straight lines for now, but SVG path is capable of smoothing if needed.
  const d = path.map((node, i) => (i === 0 ? `M ${node.x} ${node.y}` : `L ${node.x} ${node.y}`)).join(' ');

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid meet">
      {/* Route Outer Glow */}
      <motion.path
        d={d}
        fill="none"
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Core Route Line */}
      <motion.path
        d={d}
        fill="none"
        stroke="#3b82f6" // blue-500
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Moving dots animation to show direction */}
      <motion.path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 16"
        animate={{ strokeDashoffset: [20, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    </svg>
  );
}
