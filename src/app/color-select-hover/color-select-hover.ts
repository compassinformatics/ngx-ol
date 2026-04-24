import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { MapComponent } from 'ngx-ol';
import { MapBrowserEvent } from 'ol';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { Fill, Stroke, Style } from 'ol/style';

@Component({
  selector: 'app-color-select-hover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './color-select-hover.html',
  styleUrl: './color-select-hover.less',
})
export class ColorSelectHover {
  private readonly map = viewChild.required<MapComponent>('map');

  readonly center = signal<Coordinate>(transform([1.4886, 43.5554], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);
  readonly hoveredFeatureId = signal<number | null>(null);
  readonly selectedStyle = new Style({
    fill: new Fill({ color: 'rgba(0, 153, 255, 0.1)' }),
    stroke: new Stroke({ color: 'rgba(0, 153, 255)', width: 3 }),
  });
  readonly features = signal([
    this.createPolygonFeature(1, [
      [-1.4501953125, 48.40003249610685],
      [2.13134765625, 48.40003249610685],
      [2.13134765625, 50.13466432216694],
      [-1.4501953125, 50.13466432216694],
      [-1.4501953125, 48.40003249610685],
    ]),
    this.createPolygonFeature(2, [
      [5.3173828125, 47.368594345213374],
      [9.29443359375, 47.368594345213374],
      [9.29443359375, 49.36806633482156],
      [5.3173828125, 49.36806633482156],
      [5.3173828125, 47.368594345213374],
    ]),
    this.createPolygonFeature(3, [
      [-3.3837890625, 43.61221676817573],
      [1.51611328125, 43.61221676817573],
      [1.51611328125, 46.694667307773116],
      [-3.3837890625, 46.694667307773116],
      [-3.3837890625, 43.61221676817573],
    ]),
    this.createPolygonFeature(4, [
      [4.50439453125, 42.342305278572816],
      [9.16259765625, 42.342305278572816],
      [9.16259765625, 45.66012730272194],
      [4.50439453125, 45.66012730272194],
      [4.50439453125, 42.342305278572816],
    ]),
  ]);

  protected changeFeatureHovered(event: MapBrowserEvent<MouseEvent>): void {
    const hit = this.map().instance.forEachFeatureAtPixel(event.pixel, (feature) => feature, {
      hitTolerance: 10,
    }) as Feature | undefined;
    const featureId = hit?.getId();

    this.hoveredFeatureId.set(typeof featureId === 'number' ? featureId : null);
  }

  private createPolygonFeature(id: number, coordinates: number[][]): Feature<Polygon> {
    const feature = new Feature({
      geometry: new Polygon([
        coordinates.map((coordinate) => transform(coordinate, 'EPSG:4326', 'EPSG:3857')),
      ]),
    });

    feature.setId(id);

    return feature;
  }
}
