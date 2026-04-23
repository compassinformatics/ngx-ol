import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-arcgis-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './arcgis-image.html',
  styleUrl: './arcgis-image.less',
})
export class ArcgisImage {
  readonly center = signal<Coordinate>([-10997148, 4569099]);
  readonly zoom = signal(4);
  readonly serviceUrl = signal(
    'https://sampleserver6.arcgisonline.com/ArcGIS/rest/services/USA/MapServer',
  );
  readonly isLoading = signal(false);
  readonly lastLoadedAt = signal<string>('Not loaded yet');
  readonly lastErrorAt = signal<string>('None');

  protected imageLoadStart(): void {
    this.isLoading.set(true);
  }

  protected imageLoadEnd(): void {
    this.isLoading.set(false);
    this.lastLoadedAt.set(new Date().toLocaleTimeString());
  }

  protected imageLoadError(): void {
    this.isLoading.set(false);
    this.lastErrorAt.set(new Date().toLocaleTimeString());
  }
}
