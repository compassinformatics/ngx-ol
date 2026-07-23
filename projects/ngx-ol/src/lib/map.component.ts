import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  NgZone,
  input,
  output,
  signal,
} from '@angular/core';
import Map from 'ol/Map.js';
import type { MapOptions } from 'ol/Map.js';
import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import MapEvent from 'ol/MapEvent.js';
import { ObjectEvent } from 'ol/Object.js';
import RenderEvent from 'ol/render/Event.js';
import Control from 'ol/control/Control.js';
import Interaction from 'ol/interaction/Interaction.js';
import BaseEvent from 'ol/events/Event.js';
import type { EventsKey } from 'ol/events.js';
import { unByKey } from 'ol/Observable.js';

@Component({
  selector: 'aol-map',
  template: `
    <div [style.width]="width()" [style.height]="height()"></div>
    <ng-content></ng-content>
  `,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  readonly width = input('100%');
  readonly height = input('100%');
  readonly pixelRatio = input<number>();
  readonly keyboardEventTarget = input<HTMLElement | string>();
  readonly maxTilesLoading = input<number>();
  readonly moveTolerance = input<number>();
  readonly runOutsideAngular = input(true);

  readonly olChange = output<BaseEvent>();
  readonly changeLayerGroup = output<ObjectEvent>();
  readonly changeSize = output<ObjectEvent>();
  readonly changeTarget = output<ObjectEvent>();
  readonly changeView = output<ObjectEvent>();
  readonly olClick = output<MapBrowserEvent<MouseEvent> | any>();
  readonly dblClick = output<MapBrowserEvent<MouseEvent> | any>();
  readonly olError = output<BaseEvent>();
  readonly loadEnd = output<MapEvent>();
  readonly loadStart = output<MapEvent>();
  readonly moveEnd = output<MapEvent>();
  readonly moveStart = output<MapEvent>();
  readonly pointerDrag = output<MapBrowserEvent<MouseEvent> | any>();
  readonly pointerMove = output<MapBrowserEvent<MouseEvent> | any>();
  readonly postCompose = output<RenderEvent>();
  readonly postRender = output<MapEvent>();
  readonly preCompose = output<RenderEvent>();
  readonly propertyChange = output<ObjectEvent>();
  readonly singleClick = output<MapBrowserEvent<MouseEvent> | any>();

  public instance: Map;

  protected readonly _instanceSignal = signal<Map | undefined>(undefined);

  readonly instanceSignal = this._instanceSignal.asReadonly();

  protected setInstance(instance: Map): Map {
    this.instance = instance;

    this._instanceSignal.set(instance);

    return instance;
  }
  readonly componentType: string = 'map';

  // we pass empty arrays to not get default controls/interactions because we have our own directives
  readonly controls: Control[] = [];
  readonly interactions: Interaction[] = [];
  private eventKeys: EventsKey[] = [];

  constructor(
    private readonly host: ElementRef,
    private readonly ngZone: NgZone,
  ) {}

  ngOnInit() {
    const initMap = () => {
      this.setInstance(new Map(this.createOptions()));
      this.instance.setTarget(this.host.nativeElement.firstElementChild);

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
      this.eventKeys = [
        this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event)),
        this.instance.on('change:layergroup', (event: ObjectEvent) =>
          this.changeLayerGroup.emit(event),
        ),
        this.instance.on('change:size', (event: ObjectEvent) => this.changeSize.emit(event)),
        this.instance.on('change:target', (event: ObjectEvent) => this.changeTarget.emit(event)),
        this.instance.on('change:view', (event: ObjectEvent) => this.changeView.emit(event)),
        this.instance.on('error', (event: BaseEvent) => this.olError.emit(event)),
        this.instance.on('loadend', (event: MapEvent) => this.loadEnd.emit(event)),
        this.instance.on('loadstart', (event: MapEvent) => this.loadStart.emit(event)),
        this.instance.on('moveend', (event: MapEvent) => this.moveEnd.emit(event)),
        this.instance.on('movestart', (event: MapEvent) => this.moveStart.emit(event)),
        this.instance.on('pointerdrag', (event: MapBrowserEvent<MouseEvent> | any) =>
          this.pointerDrag.emit(event),
        ),
        this.instance.on('pointermove', (event: MapBrowserEvent<MouseEvent> | any) =>
          this.pointerMove.emit(event),
        ),
        this.instance.on('postcompose', (event: RenderEvent) => this.postCompose.emit(event)),
        this.instance.on('postrender', (event: MapEvent) => this.postRender.emit(event)),
        this.instance.on('precompose', (event: RenderEvent) => this.preCompose.emit(event)),
        this.instance.on('propertychange', (event: ObjectEvent) => this.propertyChange.emit(event)),
        this.instance.on('click', (event: MapBrowserEvent<MouseEvent> | any) => {
          this.olClick.emit(event);
          handleFeatureClick(event, 'olClick');
        }),
        this.instance.on('singleclick', (event: MapBrowserEvent<MouseEvent> | any) => {
          this.singleClick.emit(event);
          handleFeatureClick(event, 'singleClick');
        }),
        this.instance.on('dblclick', (event: MapBrowserEvent<MouseEvent> | any) => {
          this.dblClick.emit(event);
          handleFeatureClick(event, 'dblClick');
        }),
      ];
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

  ngOnDestroy() {
    if (this.eventKeys.length) {
      unByKey(this.eventKeys);
      this.eventKeys = [];
    }

    this.instance.setTarget(undefined);
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
