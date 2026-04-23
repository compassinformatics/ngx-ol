import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { MapBrowserEvent } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

type UtfGridInfo = Record<string, unknown>;

type UtfGridSourceRef = {
  instance: {
    forDataAtCoordinateAndResolution(
      coordinate: Coordinate,
      resolution: number,
      callback: (data: UtfGridInfo | null | undefined | '') => void,
      request?: boolean,
    ): void;
  };
};

type ViewRef = {
  instance: {
    getResolution(): number | undefined;
  };
};

@Component({
  selector: 'app-utfgrid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './utfgrid.html',
  styleUrl: './utfgrid.less',
})
export class Utfgrid {
  private readonly utfGridSource = viewChild.required<UtfGridSourceRef>('utfGridSource');
  private readonly view = viewChild.required<ViewRef>('view');

  readonly center = signal<Coordinate>(transform([-122.4, 37.75], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);
  readonly pointsTileUrl = signal('https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png');
  readonly utfGridConfig = signal({
    tilejson: '2.2.0',
    name: 'iNaturalist observation points',
    tiles: ['https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png'],
    grids: ['https://api.inaturalist.org/v1/points/{z}/{x}/{y}.grid.json'],
    minzoom: 0,
    maxzoom: 18,
  });
  readonly info = signal<UtfGridInfo | undefined>(undefined);
  readonly hoveredInfo = computed(() =>
    this.info()
      ? JSON.stringify(this.info(), null, 2)
      : 'Move over an observation point to inspect UTFGrid data.',
  );

  protected displayInfo(event: MapBrowserEvent<MouseEvent>): void {
    if (event.dragging) {
      return;
    }

    const coordinate = event.coordinate;
    const resolution = this.view().instance.getResolution() ?? 0;

    this.utfGridSource().instance.forDataAtCoordinateAndResolution(coordinate, resolution, (data) => {
      if (data && typeof data !== 'string') {
        this.info.set(data);
        event.map.getTargetElement().style.cursor = 'pointer';
        return;
      }

      this.info.set(undefined);
      event.map.getTargetElement().style.cursor = '';
    }, true);
  }
}
