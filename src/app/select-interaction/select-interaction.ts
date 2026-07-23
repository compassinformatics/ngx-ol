import { Component, signal, viewChild } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import type { Coordinate } from 'ol/coordinate.js';
import type Layer from 'ol/layer/Layer.js';
import type { SelectEvent } from 'ol/interaction/Select.js';
import { transform } from 'ol/proj.js';

type LayerVectorRef = {
  instance: Layer;
};

@Component({
  selector: 'app-select-interaction',
  imports: [AngularOpenlayersModule],
  templateUrl: './select-interaction.html',
  styleUrl: './select-interaction.less',
})
export class SelectInteraction {
  private readonly markersLayer = viewChild<LayerVectorRef>('markersLayer');

  readonly center = signal<Coordinate>(transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);
  readonly markerFeatures = signal([
    new Feature({
      geometry: new Point(transform([5, 45], 'EPSG:4326', 'EPSG:3857')),
    }),
  ]);
  readonly selectedCount = signal(0);
  readonly selectionMessage = signal('Click the marker to select it.');

  protected readonly isMarkerLayer = (layer: Layer): boolean =>
    layer === this.markersLayer()?.instance;

  protected select(event: SelectEvent): void {
    this.selectedCount.set(event.selected.length);
    this.selectionMessage.set(
      event.selected.length > 0 ? 'Marker selected.' : 'Selection cleared.',
    );
  }
}
