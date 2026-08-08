import { calculateBearing, getBearingDifference } from './bearing';

export type ActionType = 
  | 'straight' 
  | 'slight left' | 'left' | 'sharp left' 
  | 'slight right' | 'right' | 'sharp right' 
  | 'u-turn'
  | 'elevator' | 'escalator' | 'stairs'
  | 'arrive' | 'depart';

export interface TurnClassification {
  action: ActionType;
  angle: number;
}

/**
 * Classifies a turn based on three coordinates (previous, current, next).
 * If a level change is detected, it returns the appropriate vertical action.
 */
export function classifyTurn(
  prev: { lat: number, lon: number, level?: number, type?: string },
  curr: { lat: number, lon: number, level?: number, type?: string },
  next: { lat: number, lon: number, level?: number, type?: string }
): TurnClassification {
  
  // 1. Check for floor transitions
  const lvlCurr = curr.level ?? 0;
  const lvlNext = next.level ?? 0;

  if (lvlCurr !== lvlNext) {
    if (curr.type?.includes('elevator') || next.type?.includes('elevator')) {
      return { action: 'elevator', angle: 0 };
    }
    if (curr.type?.includes('escalator') || next.type?.includes('escalator')) {
      return { action: 'escalator', angle: 0 };
    }
    if (curr.type?.includes('steps') || next.type?.includes('steps')) {
      return { action: 'stairs', angle: 0 };
    }
    // Default fallback for level change
    return { action: 'stairs', angle: 0 };
  }

  // 2. Calculate horizontal turn angle
  const bearingIn = calculateBearing(prev.lat, prev.lon, curr.lat, curr.lon);
  const bearingOut = calculateBearing(curr.lat, curr.lon, next.lat, next.lon);
  const diff = getBearingDifference(bearingIn, bearingOut);

  // 3. Classify based on angular difference
  // diff is positive for right turns, negative for left turns.
  const absDiff = Math.abs(diff);

  if (absDiff < 20) return { action: 'straight', angle: diff };
  
  if (diff >= 20 && diff < 45) return { action: 'slight right', angle: diff };
  if (diff >= 45 && diff < 120) return { action: 'right', angle: diff };
  if (diff >= 120 && diff < 170) return { action: 'sharp right', angle: diff };
  
  if (diff <= -20 && diff > -45) return { action: 'slight left', angle: diff };
  if (diff <= -45 && diff > -120) return { action: 'left', angle: diff };
  if (diff <= -120 && diff > -170) return { action: 'sharp left', angle: diff };
  
  return { action: 'u-turn', angle: diff };
}
