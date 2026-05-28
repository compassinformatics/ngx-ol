import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadFunction } from 'ol/Tile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceTileWMSComponent } from './tilewms.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-tilewms
          [url]="url()"
          [urls]="urls()"
          [params]="params()"
          [tileLoadFunction]="tileLoadFunction()"
        ></aol-source-tilewms>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceTileWMSHostComponent {
  center = [0, 0];
  zoom = 2;
  url = signal('https://example.com/wms');
  urls = signal<string[] | undefined>(undefined);
  params = signal({ LAYERS: 'basic' });
  tileLoadFunction = signal<LoadFunction | undefined>(undefined);

  @ViewChild(SourceTileWMSComponent)
  source!: SourceTileWMSComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('SourceTileWMSComponent', () => {
  let fixture: ComponentFixture<SourceTileWMSHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceTileWMSHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceTileWMSHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds WMS params into the layer source through Angular inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'basic',
    });
  });

  it('updates live WMS source bindings without recreating the source', () => {
    const host = fixture.componentInstance;
    const previousSource = host.source.instance;
    const tileLoadFunction: LoadFunction = vi.fn();
    const setTileLoadFunction = vi.spyOn(previousSource, 'setTileLoadFunction');

    host.params.set({ LAYERS: 'updated' });
    host.url.set('https://example.com/updated-wms');
    host.urls.set(['https://a.example.com/wms', 'https://b.example.com/wms']);
    host.tileLoadFunction.set(tileLoadFunction);
    fixture.detectChanges();

    expect(host.source.instance).toBe(previousSource);
    expect(host.layer.instance.getSource()).toBe(previousSource);
    expect(host.source.instance.getParams()).toMatchObject({ LAYERS: 'updated' });
    expect(host.source.instance.getUrls()).toEqual([
      'https://a.example.com/wms',
      'https://b.example.com/wms',
    ]);
    expect(setTileLoadFunction).toHaveBeenCalledWith(tileLoadFunction);
  });
});
