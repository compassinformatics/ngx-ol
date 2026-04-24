import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import { Options } from 'ol/interaction/KeyboardZoom';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-keyboardzoom',
  template: '',
  standalone: false,
})
export class KeyboardZoomInteractionComponent implements OnInit, OnDestroy {
  @Input()
  duration?: number;
  @Input()
  delta?: number;

  instance: KeyboardZoom;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new KeyboardZoom(this.createOptions());
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      duration: this.duration,
      delta: this.delta,
    };
  }
}
