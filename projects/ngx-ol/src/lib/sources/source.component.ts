import { OnChanges, OnDestroy, Directive, SimpleChanges, input, signal } from '@angular/core';
import Source, { AttributionLike } from 'ol/source/Source';

import { LayerComponent } from '../layers/layer.component';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SourceComponent implements OnChanges, OnDestroy {
  readonly attributions = input<AttributionLike>();

  readonly attributionsCollapsible = input<boolean>();

  public instance: Source;

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

    if (changes.attributions) {
      this.instance.setAttributions(changes.attributions.currentValue);
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
