import { Map as MapLibreMap } from 'maplibre-gl';

export class CameraController {
  private map: MapLibreMap;
  private isFollowing: boolean = false;

  constructor(map: MapLibreMap) {
    this.map = map;
  }

  public startFollowing(initialLon: number, initialLat: number, initialBearing: number) {
    this.isFollowing = true;

    this.map.easeTo({
      center: [initialLon, initialLat],
      zoom: 19,
      pitch: 60,
      bearing: initialBearing,
      duration: 1000,
      padding: { top: 0, bottom: 200, left: 0, right: 0 } // Keeps user marker at bottom-center of the screen
    });
  }

  public stopFollowing() {
    this.isFollowing = false;
    this.map.easeTo({ 
      pitch: 0, 
      bearing: 0,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      duration: 600
    });
  }

  public updatePosition(lon: number, lat: number, targetBearing: number) {
    if (!this.isFollowing) return;

    this.map.easeTo({
      center: [lon, lat],
      bearing: targetBearing,
      pitch: 60,
      zoom: 19,
      padding: { top: 0, bottom: 200, left: 0, right: 0 },
      duration: 900,
      easing: (t) => t, // Linear easing for continuous update transitions
    });
  }
}
