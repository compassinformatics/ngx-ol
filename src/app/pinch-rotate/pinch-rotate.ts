import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule } from 'ngx-ol';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-pinch-rotate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersMapModule, AngularOpenlayersTileLayersModule],
  templateUrl: './pinch-rotate.html',
  styleUrl: './pinch-rotate.less',
})
export class PinchRotateDemo {
  readonly center = signal(fromLonLat([-6.26, 53.35]));
  readonly zoom = signal(7);
  readonly threshold = signal(0.3);
  readonly duration = signal(250);

  protected setThreshold(threshold: number): void {
    if (!Number.isNaN(threshold)) {
      this.threshold.set(Number(threshold.toFixed(2)));
    }
  }

  protected setDuration(duration: number): void {
    if (!Number.isNaN(duration)) {
      this.duration.set(duration);
    }
  }
}
