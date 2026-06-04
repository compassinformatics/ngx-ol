import { Component, OnDestroy, OnInit, input, signal, inject } from '@angular/core';
import Link from 'ol/interaction/Link';
import type { Options, Params } from 'ol/interaction/Link';
import type { AnimationOptions } from 'ol/View';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-link',
  template: '',
})
export class LinkInteractionComponent implements OnInit, OnDestroy {
  readonly animate = input<boolean | AnimationOptions>();

  readonly params = input<Params[]>();

  readonly replace = input<boolean>();

  readonly prefix = input<string>();

  instance: Link;

  protected readonly _instanceSignal = signal<Link | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Link): Link {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly map = inject(MapComponent);

  ngOnInit() {
    this.setInstance(new Link(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      animate: this.animate(),
      params: this.params(),
      replace: this.replace(),
      prefix: this.prefix(),
    };
  }
}
