import { GraphNode } from './route_to_steps';

interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface NavGraph {
  nodes: Record<string, GraphNode>;
  edges: Edge[];
  adj?: Record<string, { to: string, weight: number }[]>;
}

export function heuristic(a: string, b: string, nodes: Record<string, GraphNode>): number {
  const na = nodes[a], nb = nodes[b];
  if (!na || !nb) return Infinity;
  const dx = (na.lon - nb.lon) * 85000;
  const dy = (na.lat - nb.lat) * 111000;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Finds the nearest navigation graph node to (lon, lat).
 * Prefers nodes on the same level but will always return the globally nearest node as fallback.
 * Search radius is unlimited so any feature on the map can be routed from/to.
 */
export function nearestNode(
  lon: number,
  lat: number,
  nodes: Record<string, GraphNode>,
  level?: number
): string | null {
  let bestSameLevel: string | null = null;
  let bestSameLevelDist = Infinity;
  let bestAny: string | null = null;
  let bestAnyDist = Infinity;

  for (const [k, n] of Object.entries(nodes)) {
    const dx = (n.lon - lon) * 85000;
    const dy = (n.lat - lat) * 111000;
    const d = dx * dx + dy * dy;
    if (d < bestAnyDist) {
      bestAnyDist = d;
      bestAny = k;
    }
    if (level !== undefined && n.level === level && d < bestSameLevelDist) {
      bestSameLevelDist = d;
      bestSameLevel = k;
    }
  }

  // Prefer same level if it's within 500m, otherwise use global nearest
  if (bestSameLevel && bestSameLevelDist < 500 * 500) {
    return bestSameLevel;
  }
  return bestAny;
}

/**
 * A* pathfinding. Builds adjacency list on first call and caches it on the graph object.
 * Returns ordered list of node keys from start to goal, or null if unreachable.
 */
export function computeAStar(graph: NavGraph, startKey: string, goalKey: string): string[] | null {
  // Build bidirectional adjacency list once and cache it
  if (!graph.adj) {
    const adj: Record<string, { to: string; weight: number }[]> = {};
    for (const e of graph.edges) {
      if (!adj[e.from]) adj[e.from] = [];
      adj[e.from].push({ to: e.to, weight: e.weight });
      if (!adj[e.to]) adj[e.to] = [];
      adj[e.to].push({ to: e.from, weight: e.weight });
    }
    graph.adj = adj;
  }

  const { nodes, adj } = graph;
  if (!nodes[startKey] || !nodes[goalKey]) return null;

  // Min-heap via sorted array — good enough for airport scale
  // Priority queue: [fScore, key]
  const open = new Map<string, number>(); // key -> fScore
  const openSet = new Set<string>();
  const cameFrom: Record<string, string> = {};
  const gScore: Record<string, number> = { [startKey]: 0 };

  openSet.add(startKey);
  open.set(startKey, heuristic(startKey, goalKey, nodes));

  let iters = 0;
  while (openSet.size > 0 && iters++ < 100000) {
    // Get node with lowest fScore
    let current = '';
    let lowestF = Infinity;
    for (const k of openSet) {
      const f = open.get(k) ?? Infinity;
      if (f < lowestF) { lowestF = f; current = k; }
    }
    if (!current) break;

    if (current === goalKey) {
      // Reconstruct path
      const path: string[] = [];
      let cur = current;
      while (cameFrom[cur]) {
        path.unshift(cur);
        cur = cameFrom[cur];
      }
      path.unshift(startKey);
      return path;
    }

    openSet.delete(current);
    open.delete(current);

    for (const { to, weight } of (adj[current] || [])) {
      const tentG = (gScore[current] ?? Infinity) + weight;
      if (tentG < (gScore[to] ?? Infinity)) {
        cameFrom[to] = current;
        gScore[to] = tentG;
        open.set(to, tentG + heuristic(to, goalKey, nodes));
        openSet.add(to);
      }
    }
  }

  return null;
}
