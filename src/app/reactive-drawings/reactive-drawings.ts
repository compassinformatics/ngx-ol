import { Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Collection from 'ol/Collection.js';
import Feature from 'ol/Feature.js';
import type { Coordinate } from 'ol/coordinate.js';
import type { Type as GeometryType } from 'ol/geom/Geometry.js';
import Point from 'ol/geom/Point.js';
import Polygon from 'ol/geom/Polygon.js';
import { transform } from 'ol/proj.js';

type DrawType = Extract<GeometryType, 'Point' | 'LineString' | 'Polygon'>;

@Component({
  selector: 'app-reactive-drawings',
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-drawings.html',
  styleUrl: './reactive-drawings.less',
})
export class ReactiveDrawings {
  readonly center = signal<Coordinate>(transform([-2.2, 53.1], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly drawEnabled = signal(false);
  readonly drawType = signal<DrawType>('Polygon');
  readonly drawTrace = signal(false);
  readonly drawFreehand = signal(false);
  readonly drawSnapTolerance = signal(12);
  readonly modifyEnabled = signal(true);
  readonly modifyPixelTolerance = signal(10);
  readonly snapEnabled = signal(true);
  readonly snapEdges = signal(true);
  readonly snapVertices = signal(true);
  readonly snapPixelTolerance = signal(10);
  readonly translateEnabled = signal(false);
  readonly translateHitTolerance = signal(6);
  readonly status = signal(
    'Toggle drawing interactions, draw features, or drag existing geometry.',
  );
  readonly featureCollection = new Collection<Feature>([
    new Feature({
      geometry: new Point(transform([-4.4, 54], 'EPSG:4326', 'EPSG:3857')),
    }),
    new Feature({
      geometry: createPolygon(),
    }),
  ]);

  protected toggleDrawEnabled(): void {
    this.drawEnabled.update((enabled) => !enabled);
  }

  protected setDrawType(type: DrawType): void {
    this.drawType.set(type);
  }

  protected toggleDrawTrace(): void {
    this.drawTrace.update((enabled) => !enabled);
  }

  protected toggleDrawFreehand(): void {
    this.drawFreehand.update((enabled) => !enabled);
  }

  protected setDrawSnapTolerance(tolerance: number): void {
    this.drawSnapTolerance.set(tolerance);
  }

  protected toggleModifyEnabled(): void {
    this.modifyEnabled.update((enabled) => !enabled);
  }

  protected setModifyPixelTolerance(tolerance: number): void {
    this.modifyPixelTolerance.set(tolerance);
  }

  protected toggleSnapEnabled(): void {
    this.snapEnabled.update((enabled) => !enabled);
  }

  protected toggleSnapEdges(): void {
    this.snapEdges.update((enabled) => !enabled);
  }

  protected toggleSnapVertices(): void {
    this.snapVertices.update((enabled) => !enabled);
  }

  protected setSnapPixelTolerance(tolerance: number): void {
    this.snapPixelTolerance.set(tolerance);
  }

  protected toggleTranslateEnabled(): void {
    this.translateEnabled.update((enabled) => !enabled);
  }

  protected setTranslateHitTolerance(tolerance: number): void {
    this.translateHitTolerance.set(tolerance);
  }

  protected resetFeatures(): void {
    this.featureCollection.clear();
    this.featureCollection.extend([
      new Feature({
        geometry: new Point(transform([-4.4, 54], 'EPSG:4326', 'EPSG:3857')),
      }),
      new Feature({
        geometry: createPolygon(),
      }),
    ]);
    this.status.set('Features reset.');
  }

  protected interactionStarted(name: string): void {
    this.status.set(`${name} started.`);
  }

  protected interactionEnded(name: string): void {
    this.status.set(
      `${name} ended. Features in collection: ${this.featureCollection.getLength()}.`,
    );
  }
}

function createPolygon(): Polygon {
  return new Polygon([
    [
      transform([-3.9, 52.7], 'EPSG:4326', 'EPSG:3857'),
      transform([-1.4, 52.7], 'EPSG:4326', 'EPSG:3857'),
      transform([-1.4, 54.2], 'EPSG:4326', 'EPSG:3857'),
      transform([-3.9, 54.2], 'EPSG:4326', 'EPSG:3857'),
      transform([-3.9, 52.7], 'EPSG:4326', 'EPSG:3857'),
    ],
  ]);
}
