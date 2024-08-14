import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScaleLine } from 'ol/control';
import { MapComponent } from '../map.component';
import { Units } from 'ol/control/ScaleLine';

@Component({
  selector: 'aol-control-scaleline',
  template: ` <ng-content></ng-content> `,
})
export class ControlScaleLineComponent implements OnInit, OnDestroy {
  @Input()
  units: Units;

  instance: ScaleLine;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new ScaleLine(this);
    this.map.instance.addControl(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeControl(this.instance);
  }
}
