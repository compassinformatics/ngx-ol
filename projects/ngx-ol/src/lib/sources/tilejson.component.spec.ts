import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Config } from 'ol/source/TileJSON';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceTileJSONComponent } from './tilejson.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-tilejson [tileJSON]="tileJSON"></aol-source-tilejson>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceTileJSONHostComponent {
  center = [0, 0];
  zoom = 2;
  tileJSON: Config = {
    tiles: ['https://example.com/{z}/{x}/{y}.png'],
    minzoom: 0,
    maxzoom: 3,
  };

  @ViewChild(SourceTileJSONComponent)
  source!: SourceTileJSONComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('SourceTileJSONComponent', () => {
  let fixture: ComponentFixture<SourceTileJSONHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceTileJSONHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceTileJSONHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds TileJSON configuration into the tile layer through Angular inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getTileJSON()).toEqual(
      fixture.componentInstance.tileJSON,
    );
  });
});
