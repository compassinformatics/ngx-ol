import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceTileArcGISRestComponent } from './tilearcgisrest.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-tilearcgisrest [url]="url" [params]="params()"></aol-source-tilearcgisrest>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceTileArcGISRestHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/arcgis/rest/services/demo/MapServer';
  params = signal<Record<string, string>>({ LAYERS: 'show:1', TIME: '2026-01-01' });

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
      TIME: '2026-01-01',
    });
  });

  it('updates retained ArcGIS REST params without replacing the source', () => {
    const source = fixture.componentInstance.source.instance;

    fixture.componentInstance.params.set({ LAYERS: 'show:2', TIME: '2026-01-01' });
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source.instance).toBe(source);
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'show:2',
      TIME: '2026-01-01',
    });
  });

  it('replaces the source when removed ArcGIS REST params would otherwise stay merged', () => {
    const source = fixture.componentInstance.source.instance;

    fixture.componentInstance.params.set({ LAYERS: 'show:2' });
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source.instance).not.toBe(source);
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    const params = fixture.componentInstance.source.instance.getParams();

    expect(params).toMatchObject({
      LAYERS: 'show:2',
    });
    expect(params['TIME']).toBeUndefined();
  });
});
