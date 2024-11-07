import {
  Component,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { Map } from 'ol';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapEvent from 'ol/MapEvent';
import { ObjectEvent } from 'ol/Object';
import RenderEvent from 'ol/render/Event';
import { Control } from 'ol/control';
import { Interaction } from 'ol/interaction';
import BaseEvent from 'ol/events/Event';
import { FeatureComponent } from './feature.component';

@Component({
  selector: 'aol-map',
  template: `
    <div [style.width]="width" [style.height]="height"></div>
    <ng-content></ng-content>
  `,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  width = '100%';
  @Input()
  height = '100%';
  @Input()
  pixelRatio: number;
  @Input()
  keyboardEventTarget: HTMLElement | string;
  @Input()
  loadTilesWhileAnimating: boolean;
  @Input()
  loadTilesWhileInteracting: boolean;
  @Input()
  logo: string | boolean;
  @Input()
  renderer: 'canvas' | 'webgl';

  @Output()
  olChange = new EventEmitter<BaseEvent>();
  @Output()
  olChangeLayerGroup = new EventEmitter<ObjectEvent>();
  @Output()
  olChangeSize = new EventEmitter<ObjectEvent>();
  @Output()
  olChangeTarget = new EventEmitter<ObjectEvent>();
  @Output()
  olChangeView = new EventEmitter<ObjectEvent>();
  @Output()
  olClick = new EventEmitter<MapBrowserEvent<MouseEvent>>();
  @Output()
  dblClick = new EventEmitter<MapBrowserEvent<MouseEvent>>();
  @Output()
  olError = new EventEmitter<BaseEvent>();
  @Output()
  loadEnd = new EventEmitter<MapEvent>();
  @Output()
  loadStart = new EventEmitter<MapEvent>();
  @Output()
  moveEnd = new EventEmitter<MapEvent>();
  @Output()
  moveStart = new EventEmitter<MapEvent>();
  @Output()
  pointerDrag = new EventEmitter<MapBrowserEvent<MouseEvent>>();
  @Output()
  pointerMove = new EventEmitter<MapBrowserEvent<MouseEvent>>();
  @Output()
  olPostCompose = new EventEmitter<RenderEvent>();
  @Output()
  olPostRender = new EventEmitter<RenderEvent>();
  @Output()
  olPreCompose = new EventEmitter<RenderEvent>();
  @Output()
  olPropertyChange = new EventEmitter<ObjectEvent>();
  @Output()
  postRender = new EventEmitter<MapEvent>();
  @Output()
  propertyChange = new EventEmitter<ObjectEvent>();
  @Output()
  singleClick = new EventEmitter<MapBrowserEvent<MouseEvent>>();

  public instance: Map;
  public componentType = 'map';

  // we pass empty arrays to not get default controls/interactions because we have our own directives
  controls: Control[] = [];
  interactions: Interaction[] = [];

  constructor(private host: ElementRef) {}

  ngOnInit() {
    // console.log('creating ol.Map instance with:', this);
    this.instance = new Map(this);
    this.instance.setTarget(this.host.nativeElement.firstElementChild);
    this.instance.on('change', (event: BaseEvent) => this.olChange.emit(event));
    this.instance.on('change:layergroup', (event: ObjectEvent) =>
      this.olChangeLayerGroup.emit(event),
    );
    this.instance.on('change:size', (event: ObjectEvent) => this.olChangeSize.emit(event));
    this.instance.on('change:target', (event: ObjectEvent) => this.olChangeTarget.emit(event));
    this.instance.on('change:view', (event: ObjectEvent) => this.olChangeView.emit(event));
    this.instance.on('error', (event: BaseEvent) => this.olError.emit(event));
    this.instance.on('loadend', (event: MapEvent) => this.loadEnd.emit(event));
    this.instance.on('loadstart', (event: MapEvent) => this.loadStart.emit(event));
    this.instance.on('moveend', (event: MapEvent) => this.moveEnd.emit(event));
    this.instance.on('movestart', (event: MapEvent) => this.moveStart.emit(event));
    this.instance.on('pointerdrag', (event: MapBrowserEvent<MouseEvent>) =>
      this.pointerDrag.emit(event),
    );
    this.instance.on('pointermove', (event: MapBrowserEvent<MouseEvent>) =>
      this.pointerMove.emit(event),
    );
    this.instance.on('postcompose', (event: RenderEvent) => this.olPostCompose.emit(event));
    this.instance.on('postrender', (event: RenderEvent) => this.olPostRender.emit(event));
    this.instance.on('postrender', (event: MapEvent) => this.postRender.emit(event));
    this.instance.on('precompose', (event: RenderEvent) => this.olPreCompose.emit(event));

    this.instance.on('propertychange', (event: ObjectEvent) => this.olPropertyChange.emit(event));

    // this.instance.on('click', (event: MapBrowserEvent<MouseEvent>) => this.olClick.emit(event));
    // this.instance.on('dblclick', (event: MapBrowserEvent<MouseEvent>) => this.dblClick.emit(event));
    // this.instance.on('singleclick', (event: MapBrowserEvent<MouseEvent>) => this.singleClick.emit(event));
    const handleFeatureClick = (
      event: MapBrowserEvent<MouseEvent>,
      type: 'olClick' | 'singleClick' | 'dblClick',
    ) => {
      this.instance.forEachFeatureAtPixel(event.pixel, (feature) => {
        const featureComponent = feature.get('__aol-feature');
        if (featureComponent) {
          featureComponent[type].emit({ event, feature: featureComponent.instance });
        }
      });
    };
    this.instance.on('click', (event: MapBrowserEvent<MouseEvent>) => {
      this.olClick.emit(event);
      handleFeatureClick(event, 'olClick');
    });
    this.instance.on('singleclick', (event: MapBrowserEvent<MouseEvent>) => {
      this.singleClick.emit(event);
      handleFeatureClick(event, 'singleClick');
    });
    this.instance.on('dblclick', (event: MapBrowserEvent<MouseEvent>) => {
      this.dblClick.emit(event);
      handleFeatureClick(event, 'dblClick');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const properties: { [index: string]: any } = {};
    if (!this.instance) {
      return;
    }
    for (const key in changes) {
      if (changes.hasOwnProperty(key)) {
        properties[key] = changes[key].currentValue;
      }
    }
    // console.log('changes detected in aol-map, setting new properties: ', properties);
    this.instance.setProperties(properties, false);
  }

  ngAfterViewInit() {
    this.instance.updateSize();
  }
}
