import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KeyboardPan } from 'ol/interaction';
import { MapComponent } from '../map.component';

@Component({
    selector: 'aol-interaction-keyboardpan',
    template: '',
    standalone: false
})
export class KeyboardPanInteractionComponent implements OnInit, OnDestroy {
  @Input()
  duration: number;
  @Input()
  pixelDelta: number;

  instance: KeyboardPan;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new KeyboardPan(this);
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }
}
