import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceOGCMapTileComponent } from './ogcmaptile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-ogcmaptile [url]="url"></aol-source-ogcmaptile>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceOgcMapTileHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/ogc-map-tiles.json';

  readonly source = viewChild.required<SourceOGCMapTileComponent>(SourceOGCMapTileComponent);

  readonly layer = viewChild.required<LayerTileComponent>(LayerTileComponent);
}

describe('SourceOGCMapTileComponent', () => {
  let fixture: ComponentFixture<SourceOgcMapTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceOgcMapTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceOgcMapTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds an OGC map tile source into the tile layer through template inputs', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
  });
});
