import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { SourceGeoJSONComponent } from './geojson.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectorimage>
        <aol-source-geojson [url]="url" [geometryName]="geometryName"></aol-source-geojson>
      </aol-layer-vectorimage>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceGeoJsonHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/features.geojson';
  geometryName = 'geom';

  readonly source = viewChild.required<SourceGeoJSONComponent>(SourceGeoJSONComponent);

  readonly layer = viewChild.required<LayerVectorImageComponent>(LayerVectorImageComponent);
}

describe('SourceGeoJSONComponent', () => {
  let fixture: ComponentFixture<SourceGeoJsonHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceGeoJsonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceGeoJsonHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds a GeoJSON-backed vector source into the vector image layer', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
  });
});
