import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';

@Component({
  selector: 'app-image-wms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './image-wms.html',
  styleUrl: './image-wms.less',
})
export class ImageWms {
  readonly center = signal<Coordinate>([-830000, 6970000]);
  readonly zoom = signal(7);
  readonly extent = signal<Extent>([-970000, 6830000, -690000, 7110000]);
  readonly params = signal({ LAYERS: 'EPA:ADMIN_County' });
  readonly isLoading = signal(false);
  readonly lastLoadedAt = signal<string>('Not loaded yet');

  protected imageLoadStart(): void {
    this.isLoading.set(true);
  }

  protected imageLoadEnd(): void {
    this.isLoading.set(false);
    this.lastLoadedAt.set(new Date().toLocaleTimeString());
  }
}
