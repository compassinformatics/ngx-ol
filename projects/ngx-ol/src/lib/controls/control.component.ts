import { Component, OnDestroy, OnInit, contentChild, signal } from '@angular/core';
import Control from 'ol/control/Control';
import { Options } from 'ol/control/Control';
import { MapComponent } from '../map.component';
import { ContentComponent } from '../content.component';

@Component({
  selector: 'aol-control',
  template: ` <ng-content></ng-content> `,
})
export class ControlComponent implements OnInit, OnDestroy {
  readonly content = contentChild(ContentComponent);
  readonly componentType: string = 'control';
  instance: Control;
  protected readonly _instanceSignal = signal<Control | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Control): Control {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  element: HTMLElement;

  constructor(private readonly map: MapComponent) {}

  ngOnInit() {
    const content = this.content();

    if (content) {
      this.element = content.elementRef.nativeElement;
      this.setInstance(new Control(this.createOptions()));
      this.map.instance.addControl(this.instance);
    }
  }

  ngOnDestroy() {
    if (this.instance) {
      this.map.instance.removeControl(this.instance);
    }
  }

  private createOptions(): Options {
    return {
      element: this.element,
    };
  }
}
