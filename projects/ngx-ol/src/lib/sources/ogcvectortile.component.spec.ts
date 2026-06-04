import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorTileComponent } from '../layers/layervectortile.component';
import { SourceOGCVectorTileComponent } from './ogcvectortile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectortile>
        <aol-source-ogcvectortile [url]="url">
          <aol-format-geojson></aol-format-geojson>
        </aol-source-ogcvectortile>
      </aol-layer-vectortile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceOgcVectorTileHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/ogc-vectortiles.json';

  readonly source = viewChild.required<SourceOGCVectorTileComponent>(SourceOGCVectorTileComponent);

  readonly layer = viewChild.required<LayerVectorTileComponent>(LayerVectorTileComponent);
}

describe('SourceOGCVectorTileComponent', () => {
  let fixture: ComponentFixture<SourceOgcVectorTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceOgcVectorTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceOgcVectorTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds an OGC vector tile source into the vector tile layer and prefers child helpers', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
  });
});
