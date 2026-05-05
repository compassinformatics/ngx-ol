import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Link from 'ol/interaction/Link';
import type { Options, Params } from 'ol/interaction/Link';
import type { AnimationOptions } from 'ol/View';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-interaction-link',
  template: '',
})
export class LinkInteractionComponent implements OnInit, OnDestroy {
  @Input()
  animate?: boolean | AnimationOptions;

  @Input()
  params?: Params[];

  @Input()
  replace?: boolean;

  @Input()
  prefix?: string;

  instance: Link;

  constructor(private map: MapComponent) {}

  ngOnInit() {
    this.instance = new Link(this.createOptions());
    this.map.instance.addInteraction(this.instance);
  }

  ngOnDestroy() {
    this.map.instance.removeInteraction(this.instance);
  }

  private createOptions(): Options {
    return {
      animate: this.animate,
      params: this.params,
      replace: this.replace,
      prefix: this.prefix,
    };
  }
}
