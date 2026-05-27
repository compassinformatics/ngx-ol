import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import GeoJSON from 'ol/format/GeoJSON';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FormatGeoJSONComponent } from './geojson.component';

@Component({
  template: `
    <aol-format-geojson
      [geometryName]="geometryName"
      [dataProjection]="dataProjection"
    ></aol-format-geojson>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class FormatGeoJSONHostComponent {
  geometryName = 'geom';
  dataProjection = 'EPSG:4326';

  @ViewChild(FormatGeoJSONComponent)
  format!: FormatGeoJSONComponent;
}

describe('FormatGeoJSONComponent', () => {
  let fixture: ComponentFixture<FormatGeoJSONHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatGeoJSONHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormatGeoJSONHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a GeoJSON format from template bindings', () => {
    expect(fixture.componentInstance.format.instance).toBeInstanceOf(GeoJSON);
  });
});
