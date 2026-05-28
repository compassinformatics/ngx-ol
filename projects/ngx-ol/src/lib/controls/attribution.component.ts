import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  signal,
  input,
} from '@angular/core';
import Attribution from 'ol/control/Attribution';
import { Options } from 'ol/control/Attribution';
import MapEvent from 'ol/MapEvent';
import { MapComponent } from '../map.component';

@Component({
  selector: 'aol-control-attribution',
  template: ``,
})
export class ControlAttributionComponent implements OnInit, OnChanges, OnDestroy {
  className = input<string>();
  collapsible = input<boolean>();
  collapsed = input<boolean>();
  tipLabel = input<string>();
  label = input<string | HTMLElement>();
  expandClassName = input<string>();
  collapseLabel = input<string | HTMLElement>();
  collapseClassName = input<string>();
  render = input<(event: MapEvent) => void>();
  public componentType = 'control';
  instance: Attribution;
  protected readonly _instanceSignal = signal<Attribution | undefined>(undefined);
  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Attribution): Attribution {
    this.instance = instance;
    this._instanceSignal.set(instance);
    return instance;
  }
  target: HTMLElement;

  constructor(
    private map: MapComponent,
    private element: ElementRef,
  ) {}

  ngOnInit() {
    this.target = this.element.nativeElement;
    this.initializeInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    const liveUpdateKeys: string[] = [];

    if (changes.collapsible?.currentValue !== undefined) {
      liveUpdateKeys.push('collapsible');
    }

    if (changes.collapsed?.currentValue !== undefined) {
      liveUpdateKeys.push('collapsed');
    }

    const requiresReload = Object.keys(changes).some(
      (key) => !liveUpdateKeys.includes(key) && !changes[key].firstChange,
    );

    if (requiresReload && this.instance) {
      this.reloadInstance();
      return;
    }

    if (this.instance && changes.collapsible?.currentValue !== undefined) {
      this.instance.setCollapsible(changes.collapsible.currentValue);
    }

    if (this.instance && changes.collapsed?.currentValue !== undefined) {
      this.instance.setCollapsed(changes.collapsed.currentValue);
    }
  }

  ngOnDestroy() {
    // console.log('removing aol-control-attribution');
    this.map.instance.removeControl(this.instance);
  }

  private initializeInstance() {
    this.setInstance(new Attribution(this.createOptions()));
    this.map.instance.addControl(this.instance);
  }

  private reloadInstance() {
    this.map.instance.removeControl(this.instance);
    this.initializeInstance();
  }

  private createOptions(): Options {
    return {
      className: this.className(),
      collapsible: this.collapsible(),
      collapsed: this.collapsed(),
      tipLabel: this.tipLabel(),
      label: this.label(),
      expandClassName: this.expandClassName(),
      collapseLabel: this.collapseLabel(),
      collapseClassName: this.collapseClassName(),
      render: this.render(),
      target: this.target,
    };
  }
}
