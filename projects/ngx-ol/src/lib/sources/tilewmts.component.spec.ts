import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { TileGridWMTSComponent } from '../tilegridwmts.component';
import { SourceTileWMTSComponent } from './tilewmts.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-tilewmts
          [layer]="layerName"
          [style]="styleName"
          [matrixSet]="matrixSet"
          [url]="url()"
          (tileLoadStart)="tileLoadStart($event)"
          (tileLoadEnd)="tileLoadEnd($event)"
          (tileLoadError)="tileLoadError($event)"
        >
          <aol-tilegrid-wmts
            [origin]="origin"
            [resolutions]="resolutions"
            [matrixIds]="matrixIds"
          ></aol-tilegrid-wmts>
        </aol-source-tilewmts>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceTileWmtsHostComponent {
  center = [0, 0];
  zoom = 2;
  layerName = 'demo';
  styleName = 'default';
  matrixSet = 'webmercator';
  url = signal('https://example.com/wmts');
  origin: [number, number] = [0, 0];
  resolutions = [2, 1];
  matrixIds = ['0', '1'];
  tileLoadStart = vi.fn();
  tileLoadEnd = vi.fn();
  tileLoadError = vi.fn();

  @ViewChild(SourceTileWMTSComponent)
  source!: SourceTileWMTSComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;

  @ViewChild(TileGridWMTSComponent)
  tileGrid!: TileGridWMTSComponent;
}

describe('SourceTileWMTSComponent', () => {
  let fixture: ComponentFixture<SourceTileWmtsHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceTileWmtsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceTileWmtsHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('binds a WMTS source into the tile layer and prefers the child tile grid helper', () => {
    const host = fixture!.componentInstance;

    expect(host.layer.instance.getSource()).toBe(host.source.instance);
    expect(host.source.instance.getTileGrid()).toBe(host.tileGrid.instance);
  });

  it('forwards tile load events through template outputs', () => {
    const host = fixture!.componentInstance;

    host.source.instance.dispatchEvent('tileloadstart');
    host.source.instance.dispatchEvent('tileloadend');
    host.source.instance.dispatchEvent('tileloaderror');

    expect(host.tileLoadStart).toHaveBeenCalledOnce();
    expect(host.tileLoadEnd).toHaveBeenCalledOnce();
    expect(host.tileLoadError).toHaveBeenCalledOnce();
  });

  it('recreates and re-registers the source when the URL binding changes', () => {
    const host = fixture!.componentInstance;
    const previousSource = host.source.instance;

    host.url.set('https://example.com/updated-wmts');

    fixture!.detectChanges();

    expect(host.source.instance).not.toBe(previousSource);
    expect(host.layer.instance.getSource()).toBe(host.source.instance);
  });

  it('clears the tile layer source when the source component is destroyed', () => {
    const host = fixture!.componentInstance;
    const layer = host.layer.instance;

    expect(layer.getSource()).toBe(host.source.instance);

    fixture!.destroy();
    fixture = undefined;

    expect(layer.getSource()).toBeNull();
  });
});
