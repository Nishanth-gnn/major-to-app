import { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { CameraController } from './camera_follow';
import { NavigationController } from './navigation_controller';
import { NavigationStep } from './route_to_steps';
import { calculateBearing } from './bearing';

export class NavigationSession {
  private map: MapLibreMap;
  private camera: CameraController;
  public controller: NavigationController;
  
  private simulationInterval: number | null = null;
  private userMarker: Marker;
  private currentStepIdx = 0;

  constructor(map: MapLibreMap, steps: NavigationStep[]) {
    this.map = map;
    this.camera = new CameraController(map);
    this.controller = new NavigationController(steps);

    // Create user marker (blue indicator with pulsing dot)
    const el = document.createElement('div');
    el.className = 'w-6 h-6 rounded-full bg-blue-500 border-[3px] border-white shadow-[0_0_15px_rgba(41,121,255,0.85)] flex items-center justify-center';
    const pulse = document.createElement('div');
    pulse.className = 'w-2 h-2 rounded-full bg-white animate-pulse';
    el.appendChild(pulse);

    this.userMarker = new Marker({ element: el })
      .setLngLat(steps[0].coordinates[0])
      .addTo(map);
  }

  public start() {
    this.moveToStep(0);
  }

  public stop() {
    this.camera.stopFollowing();
    this.stopSimulation();
    this.userMarker.remove();
  }

  public nextStep() {
    const steps = this.controller.getSteps();
    if (this.currentStepIdx < steps.length - 1) {
      this.moveToStep(this.currentStepIdx + 1);
    }
  }

  public prevStep() {
    if (this.currentStepIdx > 0) {
      this.moveToStep(this.currentStepIdx - 1);
    }
  }

  public moveToStep(stepIdx: number) {
    const steps = this.controller.getSteps();
    if (stepIdx < 0 || stepIdx >= steps.length) return;

    this.currentStepIdx = stepIdx;
    
    // Update navigation controller state to update UI bindings
    this.controller.setActiveStep(stepIdx);
    
    const step = steps[stepIdx];
    const startCoord = step.coordinates[0];
    const nextCoord = step.coordinates[1] || startCoord;
    const bearing = calculateBearing(startCoord[1], startCoord[0], nextCoord[1], nextCoord[0]);

    // Move user marker
    this.userMarker.setLngLat(startCoord);

    // Filter floors to this step's level
    this.updateFloorFilter(step.level);

    // Update camera position: first step snaps with startFollowing, next steps ease smoothly
    if (stepIdx === 0) {
      this.camera.startFollowing(startCoord[0], startCoord[1], bearing);
    } else {
      this.camera.updatePosition(startCoord[0], startCoord[1], bearing);
    }
  }

  public startSimulation(onStepUpdate: (idx: number) => void, onComplete: () => void) {
    this.stopSimulation();
    const steps = this.controller.getSteps();

    this.simulationInterval = window.setInterval(() => {
      if (this.currentStepIdx >= steps.length - 1) {
        this.stopSimulation();
        onComplete();
        return;
      }
      this.nextStep();
      onStepUpdate(this.currentStepIdx);
    }, 2500) as unknown as number; // 2.5 seconds per step
  }

  public stopSimulation() {
    if (this.simulationInterval !== null) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  public isSimulating(): boolean {
    return this.simulationInterval !== null;
  }

  private updateFloorFilter(level: number) {
    const layers = ['indoor', 'security', 'lounges'];
    layers.forEach(id => {
      ['fill', 'line', 'circle'].forEach(t => {
        const lid = `${id}-${t}`;
        if (this.map.getLayer(lid)) {
          this.map.setFilter(lid, [
            'any',
            ['!', ['has', '_level']],
            ['==', ['get', '_level'], level],
            ['==', ['get', 'level'], String(level)]
          ]);
        }
      });
    });
  }
}
