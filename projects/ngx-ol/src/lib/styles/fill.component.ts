import { Component, OnInit, OnChanges, SimpleChanges, inject, input, signal } from '@angular/core';
import Fill from 'ol/style/Fill.js';
import { Options } from 'ol/style/Fill.js';
import { StyleComponent } from './style.component';
import { StyleCircleComponent } from './circle.component';
import { StyleTextComponent } from './text.component';
import { Color } from 'ol/color.js';
import { ColorLike, PatternDescriptor } from 'ol/colorlike.js';

@Component({
  selector: 'aol-style-fill',
  template: ` <div class="aol-style-fill"></div> `,
})
export class StyleFillComponent implements OnInit, OnChanges {
  readonly color = input<Color | ColorLike | PatternDescriptor | null>();

  public instance: Fill;

  protected readonly _instanceSignal = signal<Fill | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Fill): Fill {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly host: StyleComponent | StyleCircleComponent | StyleTextComponent;
  private readonly styleHost = inject(StyleComponent, { optional: true });
  private readonly styleCircleHost = inject(StyleCircleComponent, { optional: true });
  private readonly styleTextHost = inject(StyleTextComponent, { optional: true });

  constructor() {
    if (!this.styleHost) {
      throw new Error('aol-style-fill must be a descendant of aol-style');
    }
    if (!!this.styleTextHost) {
      this.host = this.styleTextHost;
    } else if (!!this.styleCircleHost) {
      this.host = this.styleCircleHost;
    } else {
      this.host = this.styleHost;
    }
    // console.log('creating aol-style-fill with: ', this);
  }

  ngOnInit() {
    // console.log('creating ol.style.Fill instance with: ', this);
    this.setInstance(new Fill(this.createOptions()));
    switch (this.host.componentType) {
      case 'style':
        this.host.instance.setFill(this.instance);
        // console.log('setting ol.style instance\'s fill:', this.host);
        break;
      case 'style-text':
        this.host.instance.setFill(this.instance);
        break;
      case 'style-circle':
        (this.host as StyleCircleComponent).setFill(this.instance);
        // console.log('setting ol.style.circle instance\'s fill:', this.host);
        break;
      default:
        throw new Error('unknown host type: ' + this.host);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }
    if (changes.color) {
      this.instance.setColor(changes.color.currentValue);
    }
    this.host.update();
    // console.log('changes detected in aol-style-fill, setting new color: ', changes);
  }

  private createOptions(): Options {
    return {
      color: this.color(),
    };
  }
}
