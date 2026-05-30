import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularOpenlayersModule } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import type { Units } from 'ol/control/ScaleLine';
import { transform } from 'ol/proj';

@Component({
  selector: 'app-reactive-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './reactive-controls.html',
  styleUrl: './reactive-controls.less',
})
export class ReactiveControls {
  readonly center = signal<Coordinate>(transform([-3.2, 54.8], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(6);
  readonly scaleUnits = signal<Units>('metric');
  readonly overviewCollapsed = signal(false);
  readonly overviewCollapsible = signal(true);
  readonly overviewRotateWithView = signal(false);
  readonly attributionCollapsed = signal(false);
  readonly mouseProjection = signal('EPSG:4326');

  protected setScaleUnits(units: Units): void {
    this.scaleUnits.set(units);
  }

  protected setMouseProjection(projection: string): void {
    this.mouseProjection.set(projection);
  }

  protected toggleOverviewCollapsed(): void {
    this.overviewCollapsed.update((collapsed) => !collapsed);
  }

  protected toggleOverviewCollapsible(): void {
    this.overviewCollapsible.update((collapsible) => !collapsible);
  }

  protected toggleOverviewRotation(): void {
    this.overviewRotateWithView.update((rotateWithView) => !rotateWithView);
  }

  protected toggleAttribution(): void {
    this.attributionCollapsed.update((collapsed) => !collapsed);
  }
}
