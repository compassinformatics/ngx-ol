import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, EventEmitter, Output } from '@angular/core';
import View from 'ol/View';
import { MapComponent } from './map.component';
import { ObjectEvent } from 'ol/Object';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { DrawEvent } from 'ol/interaction/Draw';
import BaseEvent from 'ol/events/Event';
import { ProjectionLike } from 'ol/proj';

@Component({
  selector: 'aol-view',
  template: ` <ng-content></ng-content> `,
})
export class ViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  constrainRotation: boolean | number;
  @Input()
  enableRotation: boolean;
  @Input()
  extent: Extent;
  @Input()
  maxResolution: number;
  @Input()
  minResolution: number;
  @Input()
  maxZoom: number;
  @Input()
  minZoom: number;
  @Input()
  resolution: number;
  @Input()
  resolutions: number[];
  @Input()
  rotation: number;
  @Input()
  zoom: number;
  @Input()
  zoomFactor: number;
  @Input()
  center: Coordinate;
  @Input()
  projection: ProjectionLike;
  @Input()
  constrainOnlyCenter: boolean;
  @Input()
  smoothExtentConstraint: boolean;
  @Input()
  constrainResolution: boolean;
  @Input()
  smoothResolutionConstraint: boolean;
  @Input()
  showFullExtent: boolean;
  @Input()
  multiWorld: boolean;

  @Input()
  zoomAnimation = false;

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  changeCenter = new EventEmitter<ObjectEvent>();
  @Output()
  changeResolution = new EventEmitter<ObjectEvent>();
  @Output()
  changeRotation = new EventEmitter<ObjectEvent>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();

  public instance: View;
  public componentType = 'view';

  constructor(private host: MapComponent) {}

  ngOnInit() {
    // console.log('creating ol.View instance with: ', this);
    this.instance = new View(this);
    this.host.instance.setView(this.instance);

    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:center', (event: ObjectEvent) => this.changeCenter.emit(event));
    this.instance.on('change:resolution', (event: ObjectEvent) => this.changeResolution.emit(event));
    this.instance.on('change:rotation', (event: ObjectEvent) => this.changeRotation.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'zoom':
            /** Work-around: setting the zoom via setProperties does not work. */
            if (this.zoomAnimation) {
              this.instance.animate({ zoom: changes[key].currentValue });
            } else {
              this.instance.setZoom(changes[key].currentValue);
            }
            break;
          case 'projection':
            this.instance = new View(this);
            this.host.instance.setView(this.instance);
            break;
          case 'center':
            /** Work-around: setting the center via setProperties does not work. */
            this.instance.setCenter(changes[key].currentValue);
            break;
          default:
            break;
        }
        properties[key] = changes[key].currentValue;
      }
    }
    // console.log('changes detected in aol-view, setting new properties: ', properties);
    this.instance.setProperties(properties, false);
  }

  ngOnDestroy() {
    // console.log('removing aol-view');
  }
}
