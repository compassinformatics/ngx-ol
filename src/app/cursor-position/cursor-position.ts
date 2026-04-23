import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { AngularOpenlayersModule } from 'ngx-ol';

@Component({
  selector: 'app-cursor-position',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './cursor-position.html',
  styleUrl: './cursor-position.less',
})
export class CursorPosition {
  readonly center = signal<Coordinate>([165710.0612081572, 5404417.193971128]);
  readonly lon = signal(0);
  readonly lat = signal(0);
  readonly formattedLongitude = computed(() => this.toSexagesimal(this.lon()));
  readonly formattedLatitude = computed(() => this.toSexagesimal(this.lat()));

  protected dispatchCursor(event: MapBrowserEvent<MouseEvent>): void {
    const [lon, lat] = transform(event.coordinate, 'EPSG:3857', 'EPSG:4326') as Coordinate;
    this.lon.set(lon);
    this.lat.set(lat);
  }

  private toSexagesimal(value: number): string {
    const normalizedValue = ((value + 180) % 360) - 180;
    const prefix = normalizedValue > 0 ? '' : '-';
    return `${prefix}${Math.abs(normalizedValue).toFixed(6)}`;
  }
}
