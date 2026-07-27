export type POIType = 'gate' | 'security' | 'restroom' | 'lounge' | 'food' | 'medical' | 'charging' | 'info' | 'entrance' | 'escalator' | 'shopping' | 'baggage' | 'immigration' | 'ticket';

export interface POINode {
  id: string;
  label: string;
  category: POIType;
  x: number;
  y: number;
  floor: number;
}

export const pois: POINode[] = [
  { id: 'main_entrance', label: 'Main Entrance', category: 'entrance', x: 320, y: 1000, floor: 1 },
  { id: 'exit', label: 'Exit', category: 'entrance', x: 800, y: 1000, floor: 1 },
  { id: 'tech_express', label: 'Tech Express', category: 'shopping', x: 280, y: 770, floor: 1 },
  { id: 'duty_free', label: 'Duty Free', category: 'shopping', x: 150, y: 770, floor: 1 },
  { id: 'local_handicrafts', label: 'Local Handicrafts', category: 'shopping', x: 180, y: 900, floor: 1 },
  { id: 'bake_and_brew', label: 'Bake & Brew', category: 'food', x: 920, y: 780, floor: 1 },
  { id: 'ticket_check', label: 'Ticket Check', category: 'ticket', x: 550, y: 680, floor: 1 },
  { id: 'information_desk', label: 'Information Desk', category: 'info', x: 550, y: 600, floor: 1 },
  { id: 'baggage_drop_west', label: 'Baggage Drop (West)', category: 'baggage', x: 220, y: 480, floor: 1 },
  { id: 'baggage_drop_east', label: 'Baggage Drop (East)', category: 'baggage', x: 900, y: 480, floor: 1 },
  { id: 'security_check', label: 'Security Check', category: 'security', x: 550, y: 320, floor: 1 },
  { id: 'immigration_west', label: 'Immigration (West)', category: 'immigration', x: 250, y: 320, floor: 1 },
  { id: 'immigration_east', label: 'Immigration (East)', category: 'immigration', x: 870, y: 320, floor: 1 },
  { id: 'lounge', label: 'Lounge', category: 'lounge', x: 220, y: 150, floor: 1 },
  { id: 'reading_lounge', label: 'Reading Lounge', category: 'lounge', x: 380, y: 150, floor: 1 },
  { id: 'business_center', label: 'Business Center', category: 'lounge', x: 670, y: 150, floor: 1 },
  { id: 'fast_bites', label: 'Fast Bites', category: 'food', x: 780, y: 150, floor: 1 },
  { id: 'premium_coffee', label: 'Premium Coffee Co.', category: 'food', x: 890, y: 150, floor: 1 },
  { id: 'gate_a1', label: 'Gate A1', category: 'gate', x: 100, y: 150, floor: 1 },
  { id: 'gate_a2', label: 'Gate A2', category: 'gate', x: 170, y: 50, floor: 1 },
  { id: 'gate_a4', label: 'Gate A4', category: 'gate', x: 400, y: 50, floor: 1 },
  { id: 'gate_a5', label: 'Gate A5', category: 'gate', x: 550, y: 30, floor: 1 },
  { id: 'gate_a6', label: 'Gate A6', category: 'gate', x: 700, y: 50, floor: 1 },
  { id: 'gate_b1', label: 'Gate B1', category: 'gate', x: 980, y: 50, floor: 1 },
  { id: 'gate_b2', label: 'Gate B2', category: 'gate', x: 1050, y: 150, floor: 1 },
  { id: 'gate_b3', label: 'Gate B3', category: 'gate', x: 1050, y: 250, floor: 1 },
  { id: 'waiting_area', label: 'Waiting Area', category: 'lounge', x: 550, y: 830, floor: 1 }
];

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

const waypoints: GraphNode[] = [
  { id: 'wp_entrance', x: 320, y: 920 },
  { id: 'wp_exit', x: 800, y: 920 },
  { id: 'wp_wait_mid', x: 550, y: 850 },
  { id: 'wp_wait_w', x: 250, y: 850 },
  { id: 'wp_wait_e', x: 900, y: 850 },
  { id: 'wp_ticket', x: 550, y: 730 },
  { id: 'wp_info', x: 550, y: 640 },
  { id: 'wp_baggage', x: 550, y: 530 },
  { id: 'wp_baggage_w', x: 220, y: 530 },
  { id: 'wp_baggage_e', x: 900, y: 530 },
  { id: 'wp_sec_in', x: 550, y: 400 },
  { id: 'wp_immi_w_in', x: 250, y: 400 },
  { id: 'wp_immi_e_in', x: 870, y: 400 },
  { id: 'wp_sec_out', x: 550, y: 230 },
  { id: 'wp_immi_w_out', x: 250, y: 230 },
  { id: 'wp_immi_e_out', x: 870, y: 230 },
  { id: 'wp_corridor_w1', x: 380, y: 230 },
  { id: 'wp_corridor_w2', x: 220, y: 230 },
  { id: 'wp_corridor_w3', x: 100, y: 230 },
  { id: 'wp_corridor_e1', x: 670, y: 230 },
  { id: 'wp_corridor_e2', x: 780, y: 230 },
  { id: 'wp_corridor_e3', x: 890, y: 230 },
  { id: 'wp_corridor_e4', x: 980, y: 230 }
];

export const allNodes: (POINode | GraphNode)[] = [...pois, ...waypoints];

export const edges: [string, string][] = [
  ['main_entrance', 'wp_entrance'],
  ['exit', 'wp_exit'],
  ['wp_entrance', 'wp_wait_w'],
  ['wp_exit', 'wp_wait_e'],
  ['wp_wait_w', 'wp_wait_mid'],
  ['wp_wait_mid', 'wp_wait_e'],
  ['wp_wait_mid', 'waiting_area'],
  
  // Wait West features
  ['wp_wait_w', 'local_handicrafts'],
  ['wp_wait_w', 'duty_free'],
  ['wp_wait_w', 'tech_express'],
  
  // Wait East features
  ['wp_wait_e', 'bake_and_brew'],
  
  // Go up
  ['wp_wait_mid', 'wp_ticket'],
  ['wp_ticket', 'ticket_check'],
  ['wp_ticket', 'wp_info'],
  ['wp_info', 'information_desk'],
  ['wp_info', 'wp_baggage'],
  ['wp_baggage', 'wp_baggage_w'],
  ['wp_baggage', 'wp_baggage_e'],
  ['wp_baggage_w', 'baggage_drop_west'],
  ['wp_baggage_e', 'baggage_drop_east'],
  
  // Security and Immigration
  ['wp_baggage', 'wp_sec_in'],
  ['wp_baggage_w', 'wp_immi_w_in'],
  ['wp_baggage_e', 'wp_immi_e_in'],
  ['wp_sec_in', 'security_check'],
  ['wp_immi_w_in', 'immigration_west'],
  ['wp_immi_e_in', 'immigration_east'],
  
  ['security_check', 'wp_sec_out'],
  ['immigration_west', 'wp_immi_w_out'],
  ['immigration_east', 'wp_immi_e_out'],
  
  // Corridors connect at the top
  ['wp_immi_w_out', 'wp_corridor_w2'],
  ['wp_sec_out', 'wp_corridor_w1'],
  ['wp_sec_out', 'gate_a5'],
  ['wp_sec_out', 'wp_corridor_e1'],
  ['wp_immi_e_out', 'wp_corridor_e3'],
  
  // West Corridor routing
  ['wp_corridor_w1', 'reading_lounge'],
  ['wp_corridor_w1', 'gate_a4'],
  ['wp_corridor_w1', 'wp_corridor_w2'],
  ['wp_corridor_w2', 'lounge'],
  ['wp_corridor_w2', 'gate_a2'],
  ['wp_corridor_w2', 'wp_corridor_w3'],
  ['wp_corridor_w3', 'gate_a1'],
  
  // East Corridor routing
  ['wp_corridor_e1', 'business_center'],
  ['wp_corridor_e1', 'gate_a6'],
  ['wp_corridor_e1', 'wp_corridor_e2'],
  ['wp_corridor_e2', 'fast_bites'],
  ['wp_corridor_e2', 'wp_corridor_e3'],
  ['wp_corridor_e3', 'premium_coffee'],
  ['wp_corridor_e3', 'wp_corridor_e4'],
  ['wp_corridor_e4', 'gate_b1'],
  ['wp_corridor_e4', 'gate_b2'],
  ['wp_corridor_e4', 'gate_b3']
];

const distance = (n1: GraphNode | POINode, n2: GraphNode | POINode) => {
  return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
};

const graph: Record<string, { node: string, dist: number }[]> = {};
allNodes.forEach(n => { graph[n.id] = []; });

edges.forEach(([a, b]) => {
  if (graph[a] && graph[b]) {
    const nodeA = allNodes.find(n => n.id === a)!;
    const nodeB = allNodes.find(n => n.id === b)!;
    const d = distance(nodeA, nodeB);
    graph[a].push({ node: b, dist: d });
    graph[b].push({ node: a, dist: d });
  }
});

export function findShortestPath(startId: string, endId: string): (POINode | GraphNode)[] {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  allNodes.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
    unvisited.add(n.id);
  });
  
  dist[startId] = 0;

  while (unvisited.size > 0) {
    let curr = Array.from(unvisited).reduce((a, b) => dist[a] < dist[b] ? a : b);
    
    if (curr === endId) break;
    if (dist[curr] === Infinity) break;
    
    unvisited.delete(curr);

    for (const neighbor of graph[curr]) {
      if (unvisited.has(neighbor.node)) {
        const alt = dist[curr] + neighbor.dist;
        if (alt < dist[neighbor.node]) {
          dist[neighbor.node] = alt;
          prev[neighbor.node] = curr;
        }
      }
    }
  }

  const path: string[] = [];
  let u: string | null = endId;
  if (prev[u] !== null || u === startId) {
    while (u !== null) {
      path.unshift(u);
      u = prev[u];
    }
  }

  return path.map(id => allNodes.find(n => n.id === id)!);
}
