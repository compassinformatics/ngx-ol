import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Coordinate } from 'ol/coordinate';
import { transform } from 'ol/proj';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { ViewComponent } from 'ngx-ol';

@Component({
  selector: 'app-map-position',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule, ReactiveFormsModule],
  templateUrl: './map-position.html',
  styleUrl: './map-position.less',
})
export class MapPosition {
  private readonly destroyRef = inject(DestroyRef);
  private readonly view = viewChild.required<ViewComponent>('view');

  readonly form = new FormGroup({
    x: new FormControl(1.4886, { nonNullable: true }),
    y: new FormControl(43.5554, { nonNullable: true }),
    zoom: new FormControl(4, { nonNullable: true }),
  });
  readonly center = signal(
    transform(
      [this.form.controls.x.value, this.form.controls.y.value],
      'EPSG:4326',
      'EPSG:3857',
    ) as Coordinate,
  );
  readonly zoom = signal(this.form.controls.zoom.value);

  constructor() {
    this.form.controls.x.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateCenterFromForm());
    this.form.controls.y.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateCenterFromForm());
    this.form.controls.zoom.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((zoom) => this.zoom.set(zoom));
  }

  private updateCenterFromForm(): void {
    this.center.set(
      transform(
        [this.form.controls.x.value, this.form.controls.y.value],
        'EPSG:4326',
        'EPSG:3857',
      ) as Coordinate,
    );
  }

  protected syncFormToMap(): void {
    const center = this.view().instance.getCenter();
    const zoom = this.view().instance.getZoom();

    if (!center || zoom === undefined) {
      return;
    }

    const [longitude, latitude] = transform(center, 'EPSG:3857', 'EPSG:4326') as Coordinate;

    this.center.set(center);
    this.zoom.set(zoom);
    this.form.patchValue(
      {
        x: Number(longitude.toFixed(6)),
        y: Number(latitude.toFixed(6)),
        zoom: Number(zoom.toFixed(2)),
      },
      { emitEvent: false },
    );
  }
}
