import { Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature';
import type { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-reactive-interactions',
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-interactions.html',
  styleUrl: './reactive-interactions.less',
})
export class ReactiveInteractions {
  readonly center = signal<Coordinate>(transform([-2.2, 53.1], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly defaultDragPan = signal(true);
  readonly defaultMouseWheelZoom = signal(false);
  readonly defaultDoubleClickZoom = signal(true);
  readonly mouseWheelAnchor = signal(true);
  readonly selectEnabled = signal(true);
  readonly selectHitTolerance = signal(4);
  readonly status = signal('Toggle navigation and selection interactions.');
  readonly features = [
    new Feature({
      geometry: new Point(transform([-4.4, 54], 'EPSG:4326', 'EPSG:3857')),
      name: 'Selectable point',
    }),
  ];

  protected toggleDefaultDragPan(): void {
    this.defaultDragPan.update((enabled) => !enabled);
  }

  protected toggleDefaultMouseWheelZoom(): void {
    this.defaultMouseWheelZoom.update((enabled) => !enabled);
  }

  protected toggleDefaultDoubleClickZoom(): void {
    this.defaultDoubleClickZoom.update((enabled) => !enabled);
  }

  protected toggleMouseWheelAnchor(): void {
    this.mouseWheelAnchor.update((useAnchor) => !useAnchor);
  }

  protected toggleSelectEnabled(): void {
    this.selectEnabled.update((enabled) => !enabled);
  }

  protected setSelectHitTolerance(hitTolerance: number): void {
    this.selectHitTolerance.set(hitTolerance);
  }

  protected resetWheelTestView(): void {
    this.center.set(transform([-2.2, 53.1], 'EPSG:4326', 'EPSG:3857'));
    this.zoom.set(6);
  }

  protected selectChanged(): void {
    this.status.set(`Select interaction changed at ${new Date().toLocaleTimeString()}.`);
  }
}
