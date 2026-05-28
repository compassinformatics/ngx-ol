import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadFunction } from 'ol/Tile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceTileArcGISRestComponent } from './tilearcgisrest.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-tilearcgisrest
          [url]="url()"
          [urls]="urls()"
          [params]="params()"
          [tileLoadFunction]="tileLoadFunction()"
        ></aol-source-tilearcgisrest>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceTileArcGISRestHostComponent {
  center = [0, 0];
  zoom = 2;
  url = signal('https://example.com/arcgis/rest/services/demo/MapServer');
  urls = signal<string[] | undefined>(undefined);
  params = signal({ LAYERS: 'show:1' });
  tileLoadFunction = signal<LoadFunction | undefined>(undefined);

  @ViewChild(SourceTileArcGISRestComponent)
  source!: SourceTileArcGISRestComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('SourceTileArcGISRestComponent', () => {
  let fixture: ComponentFixture<SourceTileArcGISRestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceTileArcGISRestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceTileArcGISRestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds ArcGIS REST params into the layer source through Angular inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'show:1',
    });
  });

  it('updates live ArcGIS REST source bindings without recreating the source', () => {
    const host = fixture.componentInstance;
    const previousSource = host.source.instance;
    const tileLoadFunction: LoadFunction = vi.fn();
    const setTileLoadFunction = vi.spyOn(previousSource, 'setTileLoadFunction');

    host.params.set({ LAYERS: 'show:2' });
    host.url.set('https://example.com/arcgis/rest/services/updated/MapServer');
    host.urls.set(['https://a.example.com/MapServer', 'https://b.example.com/MapServer']);
    host.tileLoadFunction.set(tileLoadFunction);
    fixture.detectChanges();

    expect(host.source.instance).toBe(previousSource);
    expect(host.layer.instance.getSource()).toBe(previousSource);
    expect(host.source.instance.getParams()).toMatchObject({ LAYERS: 'show:2' });
    expect(host.source.instance.getUrls()).toEqual([
      'https://a.example.com/MapServer',
      'https://b.example.com/MapServer',
    ]);
    expect(setTileLoadFunction).toHaveBeenCalledWith(tileLoadFunction);
  });
});
