import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadFunction, UrlFunction } from 'ol/Tile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceVectorTileComponent } from './vectortile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectortile>
        <aol-source-vectortile
          [url]="url()"
          [urls]="urls()"
          [tileLoadFunction]="tileLoadFunction()"
          [tileUrlFunction]="tileUrlFunction()"
        >
          <aol-format-geojson></aol-format-geojson>
          <aol-tilegrid [origin]="origin" [resolutions]="resolutions"></aol-tilegrid>
        </aol-source-vectortile>
      </aol-layer-vectortile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceVectorTileHostComponent {
  center = [0, 0];
  zoom = 2;
  url = signal('https://example.com/{z}/{x}/{y}.pbf');
  urls = signal<string[] | undefined>(undefined);
  tileLoadFunction = signal<LoadFunction | undefined>(undefined);
  tileUrlFunction = signal<UrlFunction | undefined>(undefined);
  origin: [number, number] = [0, 0];
  resolutions = [2, 1];

  @ViewChild(SourceVectorTileComponent)
  source!: SourceVectorTileComponent;

  @ViewChild(LayerVectorTileComponent)
  layer!: LayerVectorTileComponent;

  @ViewChild(TileGridComponent)
  tileGrid!: TileGridComponent;
}

describe('SourceVectorTileComponent', () => {
  let fixture: ComponentFixture<SourceVectorTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceVectorTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceVectorTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds a vector tile source into the vector tile layer and prefers child helpers', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getTileGrid()).toBe(
      fixture.componentInstance.tileGrid.instance,
    );
  });

  it('updates live vector tile source bindings without recreating the source', () => {
    const host = fixture.componentInstance;
    const previousSource = host.source.instance;
    const tileLoadFunction: LoadFunction = vi.fn();
    const tileUrlFunction: UrlFunction = vi.fn();
    const setTileLoadFunction = vi.spyOn(previousSource, 'setTileLoadFunction');
    const setTileUrlFunction = vi.spyOn(previousSource, 'setTileUrlFunction');

    host.url.set('https://tiles.example.com/{z}/{x}/{y}.pbf');
    host.urls.set([
      'https://a.example.com/{z}/{x}/{y}.pbf',
      'https://b.example.com/{z}/{x}/{y}.pbf',
    ]);
    host.tileLoadFunction.set(tileLoadFunction);
    host.tileUrlFunction.set(tileUrlFunction);
    fixture.detectChanges();

    expect(host.source.instance).toBe(previousSource);
    expect(host.layer.instance.getSource()).toBe(previousSource);
    expect(host.source.instance.getUrls()).toEqual([
      'https://a.example.com/{z}/{x}/{y}.pbf',
      'https://b.example.com/{z}/{x}/{y}.pbf',
    ]);
    expect(setTileLoadFunction).toHaveBeenCalledWith(tileLoadFunction);
    expect(setTileUrlFunction).toHaveBeenCalledWith(tileUrlFunction);
  });
});
