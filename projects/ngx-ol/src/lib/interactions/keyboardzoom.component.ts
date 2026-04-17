import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KeyboardZoom } from 'ol/interaction';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-keyboardpan',
  template: '',
  standalone: false,
})
export class KeyboardZoomInteractionComponent implements OnInit, OnDestroy {
  @Input()
  duration: number;
  @Input()
  delta: number;

  instance: KeyboardZoom;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new KeyboardZoom(this);
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }
}
