import { NavigationStep } from './route_to_steps';
import { calculateDistance } from './bearing';

export class NavigationController {
  private steps: NavigationStep[];
  private currentStepIndex: number = 0;
  private totalDistance: number = 0;
  private traveledDistance: number = 0;
  
  public onStepChange?: (stepIndex: number, currentStep: NavigationStep) => void;
  public onProgressUpdate?: (remainingDistance: number, etaSeconds: number) => void;
  public onOffRoute?: () => void;

  constructor(steps: NavigationStep[]) {
    this.steps = steps;
    this.totalDistance = steps.reduce((sum, step) => sum + step.distanceMeters, 0);
  }

  public updateLocation(lat: number, lon: number, level: number) {
    if (this.currentStepIndex >= this.steps.length) return;

    const currentStep = this.steps[this.currentStepIndex];
    
    // Check floor mismatch
    if (level !== currentStep.level) {
      // Allow some grace if they just took an elevator
      if (currentStep.action !== 'elevator' && currentStep.action !== 'escalator' && currentStep.action !== 'stairs') {
        this.onOffRoute?.();
        return;
      }
    }

    // Simple progress logic: check distance to the end of the current step
    const lastCoord = currentStep.coordinates[currentStep.coordinates.length - 1];
    const distToEndOfStep = calculateDistance(lat, lon, lastCoord[1], lastCoord[0]);

    if (distToEndOfStep < 10) {
      // Reached the end of the step, advance!
      this.currentStepIndex++;
      if (this.currentStepIndex < this.steps.length) {
        this.onStepChange?.(this.currentStepIndex, this.steps[this.currentStepIndex]);
      }
    }

    // Very rough progress tracking
    const remainingInStep = Math.max(0, distToEndOfStep);
    let totalRemaining = remainingInStep;
    for (let i = this.currentStepIndex + 1; i < this.steps.length; i++) {
      totalRemaining += this.steps[i].distanceMeters;
    }

    const speedMetersPerSec = 1.4; // avg walking speed
    const etaSeconds = Math.round(totalRemaining / speedMetersPerSec);

    this.onProgressUpdate?.(totalRemaining, etaSeconds);
  }

  public getCurrentStep(): NavigationStep | undefined {
    return this.steps[this.currentStepIndex];
  }

  public setActiveStep(idx: number) {
    if (idx < 0 || idx >= this.steps.length) return;
    this.currentStepIndex = idx;
    this.onStepChange?.(idx, this.steps[idx]);

    let totalRemaining = 0;
    for (let i = idx; i < this.steps.length; i++) {
      totalRemaining += this.steps[i].distanceMeters;
    }
    const speedMetersPerSec = 1.4;
    const etaSeconds = Math.round(totalRemaining / speedMetersPerSec);
    this.onProgressUpdate?.(totalRemaining, etaSeconds);
  }

  public getSteps() {
    return this.steps;
  }
}
