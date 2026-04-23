import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';

type ProjectionCode = 'EPSG:3857' | 'EPSG:4326';

@Component({
  selector: 'app-view-projection-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './view-projection-update.html',
  styleUrl: './view-projection-update.less',
})
export class ViewProjectionUpdate {
  readonly zoom = signal(6);
  readonly viewProjection = signal<ProjectionCode>('EPSG:3857');
  readonly center = computed(() => transform([5, 45], 'EPSG:4326', this.viewProjection()));

  protected setProjection(value: string): void {
    if (value === 'EPSG:4326' || value === 'EPSG:3857') {
      this.viewProjection.set(value);
    }
  }
}
