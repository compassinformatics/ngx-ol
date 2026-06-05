import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import MVT from 'ol/format/MVT';
import Style from 'ol/style/Style';
import VectorTileSource from 'ol/source/VectorTile';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorTileComponent } from './layervectortile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectortile [source]="source" [style]="style"></aol-layer-vectortile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerVectorTileHostComponent {
  center = [0, 0];
  zoom = 2;
  source = new VectorTileSource({
    format: new MVT(),
    url: 'https://example.com/{z}/{x}/{y}.pbf',
  });
  style: Style | null = new Style();

  readonly layer = viewChild.required<LayerVectorTileComponent>(LayerVectorTileComponent);
}

describe('LayerVectorTileComponent', () => {
  let fixture: ComponentFixture<LayerVectorTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerVectorTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerVectorTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds its vector tile source and style through Angular inputs', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source,
    );
    expect(fixture.componentInstance.layer().instance.getStyle()).toBe(
      fixture.componentInstance.style,
    );
  });
});
