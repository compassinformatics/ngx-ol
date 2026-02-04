import { Input, OnDestroy, Directive } from '@angular/core';
import Source, { AttributionLike } from 'ol/source/Source';

import { LayerComponent } from '../layers/layer.component';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SourceComponent implements OnDestroy {
  @Input()
  attributions?: AttributionLike;

  @Input()
  attributionsCollapsible?: boolean;

  public instance: Source;
  public componentType = 'source';

  protected constructor(protected host: LayerComponent) {}

  ngOnDestroy() {
    if (this.host && this.host.instance) {
      this.host.instance.setSource(null);
    }
  }

  protected register(s: Source) {
    if (this.host) {
      this.host.instance.setSource(s);
    }
  }
}
