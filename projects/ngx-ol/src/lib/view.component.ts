import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  input,
  output,
  signal,
  inject,
} from '@angular/core';
import View, { ViewOptions } from 'ol/View';
import { MapComponent } from './map.component';
import { ObjectEvent } from 'ol/Object';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import BaseEvent from 'ol/events/Event';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-view',
  template: ` <ng-content></ng-content> `,
})
export class ViewComponent implements OnInit, OnChanges, OnDestroy {
  constrainRotation = input<boolean | number>();
  enableRotation = input<boolean>();
  extent = input<Extent>();
  maxResolution = input<number>();
  minResolution = input<number>();
  maxZoom = input<number>();
  minZoom = input<number>();
  resolution = input<number>();
  resolutions = input<number[] | undefined>();
  rotation = input<number>();
  zoom = input<number>();
  zoomFactor = input<number>();
  center = input<Coordinate>();
  projection = input<ProjectionLike>();
  constrainOnlyCenter = input<boolean>();
  smoothExtentConstraint = input<boolean>();
  constrainResolution = input<boolean>();
  smoothResolutionConstraint = input<boolean>();
  showFullExtent = input<boolean>();
  multiWorld = input<boolean>();
  padding = input<number[]>();

  zoomAnimation = input(false);

  olChange = output<BaseEvent>();
  changeCenter = output<ObjectEvent>();
  changeResolution = output<ObjectEvent>();
  changeRotation = output<ObjectEvent>();
  olError = output<BaseEvent>();
  propertyChange = output<ObjectEvent>();

  public instance: View;

  protected readonly _instanceSignal = signal<View | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: View): View {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  public componentType = 'view';
  private eventKeys: EventsKey[] = [];

  private readonly host = inject(MapComponent);

  ngOnInit() {
    // console.log('creating ol.View instance with: ', this);
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'zoomAnimation':
            break;
          case 'zoom':
            /** Work-around: setting the zoom via setProperties does not work. */
            if (this.zoomAnimation()) {
              this.instance.animate({ zoom: changes[key].currentValue });
            } else {
              this.instance.setZoom(changes[key].currentValue);
            }
            break;
          case 'projection':
            this.initializeInstance();
            break;
          case 'center':
            /** Work-around: setting the center via setProperties does not work. */
            this.instance.setCenter(changes[key].currentValue);
            break;
          case 'maxZoom':
            this.instance.setMaxZoom(changes[key].currentValue);
            break;
          case 'minZoom':
            this.instance.setMinZoom(changes[key].currentValue);
            break;
          case 'constrainResolution':
            this.instance.setConstrainResolution(changes[key].currentValue);
            break;
          case 'resolution':
            this.instance.setResolution(changes[key].currentValue);
            break;
          case 'rotation':
            this.instance.setRotation(changes[key].currentValue);
            break;
          default:
            break;
        }
      }
    }
  }

  ngOnDestroy() {
    this.unbindInstanceEvents();
    // console.log('removing aol-view');
  }

  private initializeInstance() {
    this.unbindInstanceEvents();
    this.setInstance(new View(this.createOptions()));
    this.host.instance.setView(this.instance);
    this.bindInstanceEvents();
  }

  private bindInstanceEvents() {
    this.eventKeys = [
      this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event)),
      this.instance.on('change:center', (event: ObjectEvent) => this.changeCenter.emit(event)),
      this.instance.on('change:resolution', (event: ObjectEvent) =>
        this.changeResolution.emit(event),
      ),
      this.instance.on('change:rotation', (event: ObjectEvent) => this.changeRotation.emit(event)),
      this.instance.on('error', (event: BaseEvent) => this.olError.emit(event)),
      this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event)),
    ];
  }

  private unbindInstanceEvents() {
    if (this.eventKeys.length) {
      unByKey(this.eventKeys);
      this.eventKeys = [];
    }
  }

  private createOptions(): ViewOptions {
    return {
      center: this.center(),
      constrainOnlyCenter: this.constrainOnlyCenter(),
      constrainResolution: this.constrainResolution(),
      constrainRotation: this.constrainRotation(),
      enableRotation: this.enableRotation(),
      extent: this.extent(),
      maxResolution: this.maxResolution(),
      maxZoom: this.maxZoom(),
      minResolution: this.minResolution(),
      minZoom: this.minZoom(),
      multiWorld: this.multiWorld(),
      padding: this.padding(),
      projection: this.projection(),
      resolution: this.resolution(),
      resolutions: this.resolutions(),
      rotation: this.rotation(),
      showFullExtent: this.showFullExtent(),
      smoothExtentConstraint: this.smoothExtentConstraint(),
      smoothResolutionConstraint: this.smoothResolutionConstraint(),
      zoom: this.zoom(),
      zoomFactor: this.zoomFactor(),
    };
  }
}
