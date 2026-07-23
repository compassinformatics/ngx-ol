import { Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { Positioning } from 'ol/Overlay.js';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-reactive-overlays',
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-overlays.html',
  styleUrl: './reactive-overlays.less',
})
export class ReactiveOverlays {
  readonly center = signal<Coordinate>(transform([-3.2, 54.8], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly marker = signal<Coordinate>(transform([-5.35, 56.05], 'EPSG:4326', 'EPSG:3857'));
  readonly overlayOffset = signal<[number, number]>([14, -18]);
  readonly overlayPositioning = signal<Positioning>('bottom-left');

  protected setOverlayPositioning(positioning: Positioning): void {
    this.overlayPositioning.set(positioning);
  }

  protected moveOverlay(): void {
    this.marker.update((coordinate) => [coordinate[0] + 120000, coordinate[1] + 55000]);
  }

  protected resetOverlay(): void {
    this.marker.set(transform([-5.35, 56.05], 'EPSG:4326', 'EPSG:3857'));
  }

  protected setOffsetX(offsetX: number): void {
    this.overlayOffset.update((offset) => [offsetX, offset[1]]);
  }

  protected setOffsetY(offsetY: number): void {
    this.overlayOffset.update((offset) => [offset[0], offsetY]);
  }
}
