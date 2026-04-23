import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import { getCenter, type Extent } from 'ol/extent';
import type { Coordinate } from 'ol/coordinate';
import Projection from 'ol/proj/Projection';

type StaticImageOption = {
  label: string;
  url: string;
};

@Component({
  selector: 'app-image-static',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './image-static.html',
  styleUrl: './image-static.less',
})
export class ImageStatic {
  readonly imageOptions = signal<StaticImageOption[]>([
    {
      label: 'xkcd online communities',
      url: 'https://imgs.xkcd.com/comics/online_communities.png',
    },
    {
      label: 'Twitter image',
      url: 'https://pbs.twimg.com/media/D7IgamEUEAA5DHE.jpg',
    },
  ]);
  readonly url = signal(this.imageOptions()[0].url);
  readonly zoom = signal(2);
  readonly opacity = signal(1);
  readonly extent = signal<Extent>([0, 0, 1024, 968]);
  readonly projection = signal(
    new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: this.extent(),
    }),
  );
  readonly center = computed(() => getCenter(this.extent()) as Coordinate);

  protected setUrl(event: Event): void {
    this.url.set((event.target as HTMLSelectElement).value);
  }
}
