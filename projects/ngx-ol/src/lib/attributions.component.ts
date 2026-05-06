import { Component, Host, contentChildren, effect, signal } from '@angular/core';
import { SourceComponent } from './sources/source.component';
import { AttributionComponent } from './attribution.component';

@Component({
  selector: 'aol-attributions',
  template: '<ng-content></ng-content>',
})
export class AttributionsComponent {
  readonly attributions = contentChildren(AttributionComponent);
  instance: Array<string>;
  protected readonly _instanceSignal = signal<Array<string> | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Array<string>): Array<string> {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() private readonly source: SourceComponent) {
    effect(() => {
      const source = this.source.instanceSignal();
      const attributions = this.attributions();

      if (source && attributions.length) {
        this.setInstance(attributions.map((cmp) => cmp.label));
        source.setAttributions(this.instance);
      }
    });
  }
}
