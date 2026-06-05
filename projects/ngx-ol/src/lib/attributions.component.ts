import { AfterViewInit, Component, contentChildren, inject, signal } from '@angular/core';
import { SourceComponent } from './sources/source.component';
import { AttributionComponent } from './attribution.component';

@Component({
  selector: 'aol-attributions',
  template: '<ng-content></ng-content>',
})
export class AttributionsComponent implements AfterViewInit {
  protected readonly attributions = contentChildren(AttributionComponent);

  instance: Array<string>;

  protected readonly _instanceSignal = signal<Array<string> | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Array<string>): Array<string> {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  private readonly source = inject(SourceComponent, { host: true });

  /* we can do this at the very end */
  ngAfterViewInit() {
    const attributions = this.attributions();

    if (attributions.length) {
      this.setInstance(attributions.map((cmp) => cmp.label));
      // console.log('setting attributions:', this.instance);
      this.source.instance.setAttributions(this.instance);
    }
  }
}
