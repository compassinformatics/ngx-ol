import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { FeatureComponent } from './feature.component';
import { MapComponent } from './map.component';

@Component({
  template: `
    <aol-map
      [width]="width"
      [height]="height"
      [runOutsideAngular]="runOutsideAngular"
      (olChange)="mapChange($event)"
      (changeLayerGroup)="mapChangeLayerGroup($event)"
      (changeSize)="mapChangeSize($event)"
      (changeTarget)="mapChangeTarget($event)"
      (changeView)="mapChangeView($event)"
      (olClick)="mapClick($event)"
      (dblClick)="mapDblClick($event)"
      (olError)="mapError($event)"
      (loadEnd)="loadEnd($event)"
      (loadStart)="loadStart($event)"
      (moveEnd)="moveEnd($event)"
      (moveStart)="moveStart($event)"
      (pointerDrag)="pointerDrag($event)"
      (pointerMove)="pointerMove($event)"
      (postCompose)="postCompose($event)"
      (preCompose)="preCompose($event)"
      (postRender)="postRender($event)"
      (propertyChange)="propertyChange($event)"
      (singleClick)="mapSingleClick($event)"
    >
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature
            [feature]="feature"
            [clickable]="true"
            (olClick)="onOlClick()"
            (singleClick)="onSingleClick()"
            (dblClick)="onDblClick()"
          ></aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class MapHostComponent {
  width = '320px';
  height = '240px';
  runOutsideAngular = false;
  center = [0, 0];
  zoom = 2;
  feature = new Feature();

  olClick = vi.fn();
  singleClick = vi.fn();
  dblClick = vi.fn();
  mapChange = vi.fn();
  mapChangeLayerGroup = vi.fn();
  mapChangeSize = vi.fn();
  mapChangeTarget = vi.fn();
  mapChangeView = vi.fn();
  mapClick = vi.fn();
  mapDblClick = vi.fn();
  mapError = vi.fn();
  loadEnd = vi.fn();
  loadStart = vi.fn();
  moveEnd = vi.fn();
  moveStart = vi.fn();
  pointerDrag = vi.fn();
  pointerMove = vi.fn();
  postCompose = vi.fn();
  preCompose = vi.fn();
  postRender = vi.fn();
  propertyChange = vi.fn();
  mapSingleClick = vi.fn();

  @ViewChild(MapComponent)
  map!: MapComponent;

  @ViewChild(FeatureComponent)
  featureComponent!: FeatureComponent;

  onOlClick() {
    this.olClick();
  }

  onSingleClick() {
    this.singleClick();
  }

  onDblClick() {
    this.dblClick();
  }
}

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class RunOutsideAngularMapHostComponent {
  center = [0, 0];
  zoom = 2;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('MapComponent', () => {
  let fixture: ComponentFixture<MapHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapHostComponent, RunOutsideAngularMapHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates the OpenLayers map from bound host inputs', () => {
    const mapTarget = fixture.nativeElement.querySelector('aol-map > div') as HTMLDivElement;

    expect(fixture.componentInstance.map.instance).toBeDefined();
    expect(mapTarget.style.width).toBe('320px');
    expect(mapTarget.style.height).toBe('240px');
  });

  it('creates the map when runOutsideAngular is disabled', () => {
    expect(fixture.componentInstance.map.instance).toBeDefined();
  });

  it('creates the map through the default runOutsideAngular path', () => {
    const outsideAngularFixture = TestBed.createComponent(RunOutsideAngularMapHostComponent);
    outsideAngularFixture.detectChanges();

    expect(outsideAngularFixture.componentInstance.map.instance).toBeDefined();

    outsideAngularFixture.destroy();
  });

  it('emits feature click outputs for clickable features', () => {
    vi.spyOn(fixture.componentInstance.map.instance, 'forEachFeatureAtPixel').mockImplementation(
      (_pixel, callback) => {
        callback(fixture.componentInstance.feature, null as any, null as any);
        return fixture.componentInstance.feature;
      },
    );

    fixture.componentInstance.map.instance.dispatchEvent({ type: 'click', pixel: [1, 1] } as any);
    fixture.componentInstance.map.instance.dispatchEvent({
      type: 'singleclick',
      pixel: [1, 1],
    } as any);
    fixture.componentInstance.map.instance.dispatchEvent({
      type: 'dblclick',
      pixel: [1, 1],
    } as any);

    expect(fixture.componentInstance.olClick).toHaveBeenCalled();
    expect(fixture.componentInstance.singleClick).toHaveBeenCalled();
    expect(fixture.componentInstance.dblClick).toHaveBeenCalled();
    expect(fixture.componentInstance.mapClick).toHaveBeenCalled();
    expect(fixture.componentInstance.mapSingleClick).toHaveBeenCalled();
    expect(fixture.componentInstance.mapDblClick).toHaveBeenCalled();
  });

  it('forwards OpenLayers map events through Angular outputs', () => {
    vi.clearAllMocks();

    fixture.componentInstance.map.instance.dispatchEvent('change');
    fixture.componentInstance.map.instance.dispatchEvent('change:layergroup');
    fixture.componentInstance.map.instance.dispatchEvent('change:size');
    fixture.componentInstance.map.instance.dispatchEvent('change:target');
    fixture.componentInstance.map.instance.dispatchEvent('change:view');
    fixture.componentInstance.map.instance.dispatchEvent('error');
    fixture.componentInstance.map.instance.dispatchEvent('loadend');
    fixture.componentInstance.map.instance.dispatchEvent('loadstart');
    fixture.componentInstance.map.instance.dispatchEvent('moveend');
    fixture.componentInstance.map.instance.dispatchEvent('movestart');
    fixture.componentInstance.map.instance.dispatchEvent('pointerdrag');
    fixture.componentInstance.map.instance.dispatchEvent('pointermove');
    fixture.componentInstance.map.instance.dispatchEvent('postcompose');
    fixture.componentInstance.map.instance.dispatchEvent('postrender');
    fixture.componentInstance.map.instance.dispatchEvent('precompose');
    fixture.componentInstance.map.instance.dispatchEvent('propertychange');

    expect(fixture.componentInstance.mapChange).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.mapChangeLayerGroup).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.mapChangeSize).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.mapChangeTarget).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.mapChangeView).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.mapError).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.loadEnd).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.loadStart).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.moveEnd).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.moveStart).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.pointerDrag).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.pointerMove).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.postCompose).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.postRender).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.preCompose).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.propertyChange).toHaveBeenCalledOnce();
  });
});
