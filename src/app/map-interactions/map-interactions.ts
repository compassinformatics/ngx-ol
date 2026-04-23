import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { altShiftKeysOnly, platformModifierKeyOnly, shiftKeyOnly } from 'ol/events/condition';
import { transform } from 'ol/proj';

type MapInteractionKey =
  | 'defaults'
  | 'doubleClickZoom'
  | 'dragAndDrop'
  | 'dragBox'
  | 'dragPan'
  | 'dragRotate'
  | 'dragRotateAndZoom'
  | 'dragZoom'
  | 'mouseWheelZoom'
  | 'pinchZoom';

@Component({
  selector: 'app-map-interactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './map-interactions.html',
  styleUrl: './map-interactions.less',
})
export class MapInteractions {
  readonly center = signal<Coordinate>(transform([-6.2603, 53.3498], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(12);
  readonly enabledInteractions = signal<ReadonlySet<MapInteractionKey>>(new Set(['defaults']));
  readonly interactionOptions: readonly { key: MapInteractionKey; label: string }[] = [
    { key: 'defaults', label: 'Default interactions' },
    { key: 'doubleClickZoom', label: 'Double click zoom' },
    { key: 'dragAndDrop', label: 'Drag and drop' },
    { key: 'dragBox', label: 'Drag box' },
    { key: 'dragPan', label: 'Drag pan' },
    { key: 'dragRotate', label: 'Drag rotate' },
    { key: 'dragRotateAndZoom', label: 'Drag rotate and zoom' },
    { key: 'dragZoom', label: 'Drag zoom' },
    { key: 'mouseWheelZoom', label: 'Mouse wheel zoom' },
    { key: 'pinchZoom', label: 'Pinch zoom' },
  ];

  protected readonly altShiftKeysOnly = altShiftKeysOnly;
  protected readonly platformModifierKeyOnly = platformModifierKeyOnly;
  protected readonly shiftKeyOnly = shiftKeyOnly;

  protected isEnabled(key: MapInteractionKey): boolean {
    return this.enabledInteractions().has(key);
  }

  protected setEnabled(key: MapInteractionKey, isEnabled: boolean): void {
    this.enabledInteractions.update((enabledInteractions) => {
      const next = new Set(enabledInteractions);

      if (isEnabled) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return next;
    });
  }
}
