import { AfterViewInit, Component, ContentChildren, Host, QueryList, signal } from '@angular/core';
import { SourceComponent } from './sources/source.component';
import { AttributionComponent } from './attribution.component';

@Component({
  selector: 'aol-attributions',
  template: '<ng-content></ng-content>',
})
export class AttributionsComponent implements AfterViewInit {
  @ContentChildren(AttributionComponent) attributions: QueryList<AttributionComponent>;
  instance: Array<string>;
  protected readonly _instanceSignal = signal<Array<string> | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Array<string>): Array<string> {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }

  constructor(@Host() private source: SourceComponent) {}

  /* we can do this at the very end */
  ngAfterViewInit() {
    if (this.attributions.length) {
      this.setInstance(this.attributions.map((cmp) => cmp.label));
      // console.log('setting attributions:', this.instance);
      this.source.instance.setAttributions(this.instance);
    }
  }
}
