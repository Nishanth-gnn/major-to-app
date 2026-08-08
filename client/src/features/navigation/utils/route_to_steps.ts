import { calculateDistance } from './bearing';
import { classifyTurn, ActionType } from './turn_classifier';

export interface GraphNode {
  lat: number;
  lon: number;
  level?: number;
  tags?: Record<string, string>;
  type?: string;
}

export interface NavigationStep {
  id: string;
  action: ActionType;
  instruction: string;
  distanceMeters: number;
  startNodeIdx: number;
  endNodeIdx: number;
  level: number;
  coordinates: [number, number][];
}

/**
 * Converts a raw list of graph nodes into human-readable navigation steps.
 */
export function convertRouteToSteps(nodes: GraphNode[]): NavigationStep[] {
  if (nodes.length < 2) return [];

  const steps: NavigationStep[] = [];
  
  let currentAction: ActionType = 'straight';
  let currentDistance = 0;
  let startIdx = 0;
  let currentCoords: [number, number][] = [[nodes[0].lon, nodes[0].lat]];
  
  const pushStep = (endIdx: number, overrideAction?: ActionType) => {
    if (currentDistance > 0 || (overrideAction && overrideAction !== 'straight')) {
      const action = overrideAction || currentAction;
      steps.push({
        id: `step-${startIdx}-${endIdx}`,
        action,
        instruction: generateInstruction(action, currentDistance, nodes[endIdx]),
        distanceMeters: Math.round(currentDistance),
        startNodeIdx: startIdx,
        endNodeIdx: endIdx,
        level: nodes[startIdx].level ?? 0,
        coordinates: currentCoords
      });
    }
  };

  for (let i = 1; i < nodes.length - 1; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const next = nodes[i + 1];

    const dist = calculateDistance(prev.lat, prev.lon, curr.lat, curr.lon);
    currentDistance += dist;
    currentCoords.push([curr.lon, curr.lat]);

    const turn = classifyTurn(prev, curr, next);

    // If there's a significant turn or a floor change, break the step
    if (turn.action !== 'straight') {
      pushStep(i);
      
      // Reset for the next step (the turn itself starts a new segment)
      startIdx = i;
      currentDistance = 0;
      currentCoords = [[curr.lon, curr.lat]];
      currentAction = turn.action;
    } else if (currentAction !== 'straight') {
      // If we just completed a turn and are now going straight, close the turn step
      pushStep(i);
      startIdx = i;
      currentDistance = 0;
      currentCoords = [[curr.lon, curr.lat]];
      currentAction = 'straight';
    }
  }

  // Add the final leg to the destination
  const lastPrev = nodes[nodes.length - 2];
  const lastNode = nodes[nodes.length - 1];
  currentDistance += calculateDistance(lastPrev.lat, lastPrev.lon, lastNode.lat, lastNode.lon);
  currentCoords.push([lastNode.lon, lastNode.lat]);
  
  pushStep(nodes.length - 1);

  // Add the "Arrive" step
  steps.push({
    id: `step-arrive`,
    action: 'arrive',
    instruction: `Arrive at destination`,
    distanceMeters: 0,
    startNodeIdx: nodes.length - 1,
    endNodeIdx: nodes.length - 1,
    level: lastNode.level ?? 0,
    coordinates: [[lastNode.lon, lastNode.lat]]
  });

  return steps;
}

function generateInstruction(action: ActionType, distance: number, node: GraphNode): string {
  const distStr = Math.round(distance);
  const landmark = node.tags?.name || node.tags?.ref || '';
  const landmarkStr = landmark ? ` near ${landmark}` : '';

  switch (action) {
    case 'straight': return `Continue straight for ${distStr}m${landmarkStr}`;
    case 'slight left': return `Slight left and continue ${distStr}m${landmarkStr}`;
    case 'left': return `Turn left and continue ${distStr}m${landmarkStr}`;
    case 'sharp left': return `Sharp left and continue ${distStr}m${landmarkStr}`;
    case 'slight right': return `Slight right and continue ${distStr}m${landmarkStr}`;
    case 'right': return `Turn right and continue ${distStr}m${landmarkStr}`;
    case 'sharp right': return `Sharp right and continue ${distStr}m${landmarkStr}`;
    case 'u-turn': return `Make a U-turn and continue ${distStr}m${landmarkStr}`;
    case 'elevator': return `Take the elevator${landmarkStr}`;
    case 'escalator': return `Take the escalator${landmarkStr}`;
    case 'stairs': return `Take the stairs${landmarkStr}`;
    default: return `Proceed ${distStr}m`;
  }
}
