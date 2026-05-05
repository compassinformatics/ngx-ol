import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Extent } from 'ol/extent.js';
import { fromLonLat } from 'ol/proj.js';

@Component({
  selector: 'app-extent-interaction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule, JsonPipe],
  templateUrl: './extent-interaction.html',
  styleUrl: './extent-interaction.less',
})
export class ExtentInteractionDemo {
  readonly center = signal(fromLonLat([-8.2, 53.45]));
  readonly zoom = signal(7);
  readonly extent = signal<Extent | undefined>(undefined);

  protected setExtent(extent: Extent): void {
    this.extent.set(extent);
  }
}
