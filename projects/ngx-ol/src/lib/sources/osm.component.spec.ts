import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceOsmComponent } from './osm.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-osm [url]="url"></aol-source-osm>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceOsmHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/{z}/{x}/{y}.png';

  @ViewChild(SourceOsmComponent)
  source!: SourceOsmComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('SourceOsmComponent', () => {
  let fixture: ComponentFixture<SourceOsmHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceOsmHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceOsmHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds an OSM source into the tile layer through template inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
  });
});
