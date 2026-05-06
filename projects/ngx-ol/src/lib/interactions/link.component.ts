import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, signal, input } from '@angular/core';
import Link from 'ol/interaction/Link';
import type { Options, Params } from 'ol/interaction/Link';
import type { AnimationOptions } from 'ol/View';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-link',
  template: '',
})
export class LinkInteractionComponent implements OnInit, OnChanges, OnDestroy {
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

  constructor(private readonly map: MapComponent) {}

  ngOnInit() {
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const requiresReload = Object.keys(changes).some((key) => !changes[key].firstChange);

    if (requiresReload && this.instance) {
      this.reloadInstance();
    }
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new Link(this.createOptions()));
    this.map.instance.addInteraction(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeInteraction(this.instance);
    this.initializeInstance();
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
