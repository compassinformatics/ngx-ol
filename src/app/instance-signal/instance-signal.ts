import { Component, viewChild } from '@angular/core';
import { AngularOpenlayersModule, MapComponent } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate.js';
import { transform, transformExtent } from 'ol/proj.js';

@Component({
  selector: 'app-instance-signal',
  imports: [AngularOpenlayersModule],
  templateUrl: './instance-signal.html',
  styleUrl: './instance-signal.less',
})
export class InstanceSignalDemo {
  protected readonly center: Coordinate = transform([-7.8, 53.4], 'EPSG:4326', 'EPSG:3857');
  protected readonly initialZoom = 6;
  protected readonly mapComponent = viewChild.required(MapComponent);

  protected fitIreland(): void {
    this.mapComponent()
      .instanceSignal()
      ?.getView()
      .fit(transformExtent([-10.8, 51.2, -5.2, 55.6], 'EPSG:4326', 'EPSG:3857'), {
        duration: 350,
        padding: [48, 48, 48, 48],
      });
  }

  protected rotate(): void {
    const view = this.mapComponent().instanceSignal()?.getView();

    if (!view) {
      return;
    }

    view.animate({
      rotation: view.getRotation() + Math.PI / 8,
      duration: 250,
    });
  }

  protected resetRotation(): void {
    this.mapComponent().instanceSignal()?.getView().animate({
      rotation: 0,
      duration: 250,
    });
  }
}
