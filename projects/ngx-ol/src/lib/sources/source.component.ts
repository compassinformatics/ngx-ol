import { OnChanges, OnDestroy, Directive, SimpleChanges, signal, input } from '@angular/core';
import Source, { AttributionLike } from 'ol/source/Source';

import { LayerComponent } from '../layers/layer.component';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SourceComponent implements OnChanges, OnDestroy {
  readonly attributions = input<AttributionLike>();
  readonly attributionsCollapsible = input<boolean>();
  instance: Source;
  protected readonly _instanceSignal = signal<Source | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Source): Source {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  readonly componentType: string = 'source';

  protected constructor(protected readonly host: LayerComponent) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }

    if (changes.hasOwnProperty('attributions')) {
      this.instance.setAttributions(this.attributions());
    }

    if (changes.hasOwnProperty('attributionsCollapsible')) {
      (this.instance as unknown as { attributionsCollapsible_?: boolean }).attributionsCollapsible_ =
        this.attributionsCollapsible() ?? true;
      this.instance.refresh();
    }
  }

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
