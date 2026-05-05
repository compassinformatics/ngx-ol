import {
  signal,
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  NgZone,
  input,
} from '@angular/core';
import Map from 'ol/Map';
import type { MapOptions } from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapEvent from 'ol/MapEvent';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';
import Control from 'ol/control/Control';
import Interaction from 'ol/interaction/Interaction';
import BaseEvent from 'ol/events/Event';

@Component({
  selector: 'aol-map',
  template: `
    <div [style.width]="width()" [style.height]="height()"></div>
    <ng-content></ng-content>
  `,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  width = input('100%');
  height = input('100%');
  pixelRatio = input<number>();
  keyboardEventTarget = input<HTMLElement | string>();
  maxTilesLoading = input<number>();
  moveTolerance = input<number>();
  runOutsideAngular = input(true);

  @Output() olChange = new EventEmitter<BaseEvent>();
  @Output() changeLayerGroup = new EventEmitter<ObjectEvent>();
  @Output() changeSize = new EventEmitter<ObjectEvent>();
  @Output() changeTarget = new EventEmitter<ObjectEvent>();
  @Output() changeView = new EventEmitter<ObjectEvent>();
  @Output() olClick = new EventEmitter<MapBrowserEvent<MouseEvent> | any>();
  @Output() dblClick = new EventEmitter<MapBrowserEvent<MouseEvent> | any>();
  @Output() olError = new EventEmitter<BaseEvent>();
  @Output() loadEnd = new EventEmitter<MapEvent>();
  @Output() loadStart = new EventEmitter<MapEvent>();
  @Output() moveEnd = new EventEmitter<MapEvent>();
  @Output() moveStart = new EventEmitter<MapEvent>();
  @Output() pointerDrag = new EventEmitter<MapBrowserEvent<MouseEvent> | any>();
  @Output() pointerMove = new EventEmitter<MapBrowserEvent<MouseEvent> | any>();
  @Output() postCompose = new EventEmitter<RenderEvent>();
  @Output() postRender = new EventEmitter<MapEvent>();
  @Output() preCompose = new EventEmitter<RenderEvent>();
  @Output() propertyChange = new EventEmitter<ObjectEvent>();
  @Output() singleClick = new EventEmitter<MapBrowserEvent<MouseEvent> | any>();

  instance: Map;

  protected readonly _instanceSignal = signal<Map | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Map): Map {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  public componentType = 'map';

  // we pass empty arrays to not get default controls/interactions because we have our own directives
  controls: Control[] = [];
  interactions: Interaction[] = [];

  constructor(
    private host: ElementRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    const initMap = () => {
      this.setInstance(new Map(this.createOptions()));
      this.instance.setTarget(this.host.nativeElement.firstElementChild);
      this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
      this.instance.on('change:layergroup', (event: ObjectEvent) =>
        this.changeLayerGroup.emit(event),
      );
      this.instance.on('change:size', (event: ObjectEvent) => this.changeSize.emit(event));
      this.instance.on('change:target', (event: ObjectEvent) => this.changeTarget.emit(event));
      this.instance.on('change:view', (event: ObjectEvent) => this.changeView.emit(event));
      this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
      this.instance.on('loadend', (event: MapEvent) => this.loadEnd.emit(event));
      this.instance.on('loadstart', (event: MapEvent) => this.loadStart.emit(event));
      this.instance.on('moveend', (event: MapEvent) => this.moveEnd.emit(event));
      this.instance.on('movestart', (event: MapEvent) => this.moveStart.emit(event));
      this.instance.on('pointerdrag', (event: MapBrowserEvent<MouseEvent> | any) =>
        this.pointerDrag.emit(event),
      );
      this.instance.on('pointermove', (event: MapBrowserEvent<MouseEvent> | any) =>
        this.pointerMove.emit(event),
      );
      this.instance.on('postcompose', (event: RenderEvent) => this.postCompose.emit(event));
      this.instance.on('postrender', (event: MapEvent) => this.postRender.emit(event));
      this.instance.on('precompose', (event: RenderEvent) => this.preCompose.emit(event));
      this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event));

      const handleFeatureClick = (
        event: MapBrowserEvent<MouseEvent> | any,
        type: 'olClick' | 'singleClick' | 'dblClick',
      ) => {
        this.instance.forEachFeatureAtPixel(event.pixel, (feature) => {
          const featureComponent = feature.get('__aol-feature');
          if (featureComponent) {
            featureComponent[type].emit({ event, feature: featureComponent.instance });
          }
        });
      };
      this.instance.on('click', (event: MapBrowserEvent<MouseEvent> | any) => {
        this.olClick.emit(event);
        handleFeatureClick(event, 'olClick');
      });
      this.instance.on('singleclick', (event: MapBrowserEvent<MouseEvent> | any) => {
        this.singleClick.emit(event);
        handleFeatureClick(event, 'singleClick');
      });
      this.instance.on('dblclick', (event: MapBrowserEvent<MouseEvent> | any) => {
        this.dblClick.emit(event);
        handleFeatureClick(event, 'dblClick');
      });
    };

    if (this.runOutsideAngular()) {
      this.ngZone.runOutsideAngular(initMap);
    } else {
      initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.instance) {
      return;
    }

    if (changes['width'] || changes['height']) {
      queueMicrotask(() => this.instance.updateSize());
    }
  }

  ngAfterViewInit() {
    this.instance.updateSize();
  }

  private createOptions(): MapOptions {
    return {
      controls: this.controls,
      interactions: this.interactions,
      keyboardEventTarget: this.keyboardEventTarget(),
      maxTilesLoading: this.maxTilesLoading(),
      moveTolerance: this.moveTolerance(),
      pixelRatio: this.pixelRatio(),
    };
  }
}
