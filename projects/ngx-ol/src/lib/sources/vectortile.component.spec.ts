import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { TileGridComponent } from '../tilegrid.component';
import { SourceVectorTileComponent } from './vectortile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectortile>
        <aol-source-vectortile [url]="url">
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
  url = 'https://example.com/{z}/{x}/{y}.pbf';
  origin: [number, number] = [0, 0];
  resolutions = [2, 1];

  readonly source = viewChild.required<SourceVectorTileComponent>(SourceVectorTileComponent);

  readonly layer = viewChild.required<LayerVectorTileComponent>(LayerVectorTileComponent);

  readonly tileGrid = viewChild.required<TileGridComponent>(TileGridComponent);
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
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
    expect(fixture.componentInstance.source().instance.getTileGrid()).toBe(
      fixture.componentInstance.tileGrid().instance,
    );
  });
});
