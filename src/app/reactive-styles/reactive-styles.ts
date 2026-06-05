import { Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-reactive-styles',
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-styles.html',
  styleUrl: './reactive-styles.less',
})
export class ReactiveStyles {
  readonly center = signal<Coordinate>(transform([-4, 53.7], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly point = signal<[number, number]>([-4.2, 54.4]);
  readonly line = signal([
    [-6.4, 52.8],
    [-4.1, 53.7],
    [-1.7, 55],
  ]);
  readonly polygonOffset = signal(0);
  readonly circleRadius = signal(150000);
  readonly markerRadius = signal(10);
  readonly markerRotation = signal(0);
  readonly strokeWidth = signal(3);
  readonly strokeDash = signal(false);
  readonly fillOpacity = signal(0.28);
  readonly labelText = signal('Reactive style');
  readonly labelScale = signal(1.2);
  readonly labelOffsetY = signal(-22);
  readonly labelRotation = signal(0);
  readonly labelPlacement = signal<'point' | 'line'>('point');

  readonly polygon = computed(() => {
    const offset = this.polygonOffset();

    return [
      [
        [-5.8 + offset, 53.1],
        [-3.4 + offset, 52.7],
        [-2.6 + offset, 54.2],
        [-4.6 + offset, 55.1],
        [-5.8 + offset, 53.1],
      ],
    ];
  });
  readonly strokeDashPattern = computed(() => (this.strokeDash() ? [12, 8] : undefined));
  readonly fillColor = computed(() => `rgb(14 165 233 / ${this.fillOpacity()})`);

  protected setPointLongitude(longitude: number): void {
    this.point.update((point) => [longitude, point[1]]);
  }

  protected setPointLatitude(latitude: number): void {
    this.point.update((point) => [point[0], latitude]);
  }

  protected setPolygonOffset(offset: number): void {
    this.polygonOffset.set(offset);
  }

  protected setCircleRadius(radius: number): void {
    this.circleRadius.set(radius);
  }

  protected setMarkerRadius(radius: number): void {
    this.markerRadius.set(radius);
  }

  protected setMarkerRotation(rotation: number): void {
    this.markerRotation.set(rotation);
  }

  protected setStrokeWidth(width: number): void {
    this.strokeWidth.set(width);
  }

  protected toggleStrokeDash(): void {
    this.strokeDash.update((enabled) => !enabled);
  }

  protected setFillOpacity(opacity: number): void {
    this.fillOpacity.set(opacity);
  }

  protected setLabelText(text: string): void {
    this.labelText.set(text);
  }

  protected setLabelScale(scale: number): void {
    this.labelScale.set(scale);
  }

  protected setLabelOffsetY(offset: number): void {
    this.labelOffsetY.set(offset);
  }

  protected setLabelRotation(rotation: number): void {
    this.labelRotation.set(rotation);
  }

  protected setLabelPlacement(placement: 'point' | 'line'): void {
    this.labelPlacement.set(placement);
  }
}
