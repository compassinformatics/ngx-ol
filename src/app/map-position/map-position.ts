import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { ViewComponent } from 'ngx-ol';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-map-position',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule, ReactiveFormsModule],
  templateUrl: './map-position.html',
  styleUrl: './map-position.less',
})
export class MapPosition {
  private readonly view = viewChild.required<ViewComponent>('view');

  readonly form = new FormGroup({
    x: new FormControl(1.4886, { nonNullable: true }),
    y: new FormControl(43.5554, { nonNullable: true }),
    zoom: new FormControl(4, { nonNullable: true }),
  });
  readonly center = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      map(({ x, y }) => transform([x ?? 0, y ?? 0], 'EPSG:4326', 'EPSG:3857')),
    ),
    {
      initialValue: transform(
        [this.form.controls.x.value, this.form.controls.y.value],
        'EPSG:4326',
        'EPSG:3857',
      ),
    },
  );

  readonly moving = signal(false);
  readonly currentZoom = signal(0);
  readonly currentLongitude = signal(0);
  readonly currentLatitude = signal(0);

  protected startMoving(): void {
    this.moving.set(true);
  }

  protected displayCoordinates(): void {
    const center = this.view().instance.getCenter();
    const zoom = this.view().instance.getZoom();

    if (!center || zoom === undefined) {
      return;
    }

    const [longitude, latitude] = transform(center, 'EPSG:3857', 'EPSG:4326') as Coordinate;

    this.moving.set(false);
    this.currentZoom.set(zoom);
    this.currentLongitude.set(longitude);
    this.currentLatitude.set(latitude);
  }
}
