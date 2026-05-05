import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  AngularOpenlayersMapModule,
  AngularOpenlayersTileLayersModule,
  MapComponent,
  SourceIIIFComponent,
} from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import IIIFInfo from 'ol/format/IIIFInfo';
import type { ImageInformationResponse } from 'ol/format/IIIFInfo';
import type { Options } from 'ol/source/IIIF';
import View from 'ol/View';

@Component({
  selector: 'app-iiif',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './iiif.html',
  styleUrl: './iiif.less',
})
export class Iiif implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly map = viewChild<MapComponent>('map');
  private readonly source = viewChild<SourceIIIFComponent>('iiifSource');

  readonly imageInfoUrl =
    'https://iiif.ub.uni-leipzig.de/iiif/j2k/0000/0107/0000010732/00000072.jpx/info.json';
  readonly iiifOptions = signal<Options | undefined>(undefined);
  readonly viewReady = signal(false);
  readonly error = signal('');
  readonly resolutions = computed(() => this.iiifOptions()?.resolutions ?? undefined);
  readonly extent = computed<Extent>(() => {
    const options = this.iiifOptions();
    const size = options?.size;

    if (!size) {
      return [0, -1, 1, 0];
    }

    return options.extent ?? [0, -size[1], size[0], 0];
  });
  readonly center = computed<Coordinate>(() => {
    const [minX, minY, maxX, maxY] = this.extent();

    return [(minX + maxX) / 2, (minY + maxY) / 2];
  });
  readonly resolution = computed(() => {
    const resolutions = this.resolutions();

    return resolutions?.[0] ?? 1;
  });

  constructor() {
    effect(() => {
      const map = this.map();
      const source = this.source();

      if (!map || !source?.instance || this.viewReady()) {
        return;
      }

      const tileGrid = source.instance.getTileGrid();
      if (!tileGrid) {
        return;
      }

      const extent = tileGrid.getExtent();

      if (!extent) {
        return;
      }

      const view = new View({
        resolutions: tileGrid.getResolutions(),
        extent,
        constrainOnlyCenter: true,
      });
      map.instance.setView(view);
      view.fit(extent, {
        size: map.instance.getSize(),
      });
      this.viewReady.set(true);
    });
  }

  ngOnInit() {
    this.http.get<ImageInformationResponse>(this.imageInfoUrl).subscribe({
      next: (imageInfo) => {
        const options = new IIIFInfo(imageInfo).getTileSourceOptions();

        if (!options?.version) {
          this.error.set('The response was not valid IIIF image information.');
          return;
        }

        const extent = options.extent ?? [0, -options.size[1], options.size[0], 0];

        this.iiifOptions.set({
          ...options,
          extent,
          resolutions: options.resolutions ?? undefined,
          zDirection: -1,
        });
      },
      error: () => {
        this.error.set('Could not load the IIIF info.json response.');
      },
    });
  }
}
