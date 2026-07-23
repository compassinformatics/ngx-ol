import { Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate.js';
import { transform } from 'ol/proj.js';

@Component({
  selector: 'app-clickable-feature',
  imports: [AngularOpenlayersModule],
  templateUrl: './clickable-feature.html',
  styleUrl: './clickable-feature.less',
})
export class ClickableFeatureDemo {
  readonly center = signal<Coordinate>(transform([5, 45], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly clickCount = signal(0);
  readonly singleClickCount = signal(0);
  readonly doubleClickCount = signal(0);
  readonly lastMessage = signal('Click the feature to trigger its outputs.');

  protected handleClick(): void {
    this.clickCount.update((count) => count + 1);
    this.lastMessage.set('Feature `olClick` fired.');
  }

  protected handleSingleClick(): void {
    this.singleClickCount.update((count) => count + 1);
    this.lastMessage.set('Feature `singleClick` fired.');
  }

  protected handleDoubleClick(): void {
    this.doubleClickCount.update((count) => count + 1);
    this.lastMessage.set('Feature `dblClick` fired.');
  }

  protected reset(): void {
    this.clickCount.set(0);
    this.singleClickCount.set(0);
    this.doubleClickCount.set(0);
    this.lastMessage.set('Click the feature to trigger its outputs.');
  }
}
