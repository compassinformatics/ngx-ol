import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { AngularOpenlayersModule } from 'ngx-ol';

type TileWmsSourceRef = {
  instance: {
    getFeatureInfoUrl(
      coordinate: Coordinate,
      resolution: number,
      projection: string,
      params: Record<string, string>,
    ): string | undefined;
  };
};

type FeatureInfoResponse = {
  features?: Array<{
    id?: string;
    properties?: Record<string, unknown>;
  }>;
};

@Component({
  selector: 'app-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './overlay.html',
  styleUrl: './overlay.less',
})
export class Overlay {
  private readonly wmsSource = viewChild.required<TileWmsSourceRef>('wmsSource');

  readonly zoom = signal(7);
  readonly center = signal<Coordinate>([-871993.618677, 7062781.41355]);
  readonly staticOverlayPosition = signal<Coordinate>([-1161993.618677, 7382781.41355]);
  readonly popupPosition = signal<Coordinate | undefined>(undefined);
  readonly isLoading = signal(false);
  readonly popupTitle = signal('');
  readonly popupBody = signal('');

  protected async showInfoPopup(event: MapBrowserEvent<MouseEvent>): Promise<void> {
    const resolution = event.map.getView().getResolution();
    const projection = event.map.getView().getProjection().getCode();

    if (!resolution || !projection) {
      return;
    }

    const featureInfoUrl = this.wmsSource().instance.getFeatureInfoUrl(
      event.coordinate,
      resolution,
      projection,
      { INFO_FORMAT: 'application/json' },
    );

    if (!featureInfoUrl) {
      this.isLoading.set(false);
      this.popupPosition.set(undefined);
      return;
    }

    this.popupTitle.set('Loading feature info');
    this.popupBody.set('Fetching feature info...');
    this.popupPosition.set(event.coordinate);
    this.isLoading.set(true);

    try {
      const response = await fetch(featureInfoUrl);
      const payload = (await response.json()) as FeatureInfoResponse;
      const feature = payload.features?.[0];

      if (!feature) {
        this.isLoading.set(false);
        this.popupPosition.set(undefined);
        return;
      }

      this.popupTitle.set(feature.id ?? 'Feature info');
      this.popupBody.set(JSON.stringify(feature.properties ?? {}, null, 2));
      this.popupPosition.set(event.coordinate);
      this.isLoading.set(false);
    } catch {
      this.popupTitle.set('Feature info unavailable');
      this.popupBody.set('The server did not return feature information for this click.');
      this.popupPosition.set(event.coordinate);
      this.isLoading.set(false);
    }
  }

  protected closePopup(): void {
    this.isLoading.set(false);
    this.popupPosition.set(undefined);
  }
}
