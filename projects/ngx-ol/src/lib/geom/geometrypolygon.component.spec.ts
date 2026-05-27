import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Polygon from 'ol/geom/Polygon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryPolygonComponent } from './geometrypolygon.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-polygon>
              <aol-collection-coordinates [coordinates]="coordinates" [srid]="srid"></aol-collection-coordinates>
            </aol-geometry-polygon>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryPolygonHostComponent {
  center = [0, 0];
  zoom = 2;
  srid = 'EPSG:3857';
  coordinates = [
    [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 0],
    ],
  ];

  @ViewChild(GeometryPolygonComponent)
  geometry!: GeometryPolygonComponent;

  @ViewChild(FeatureComponent)
  feature!: FeatureComponent;
}

describe('GeometryPolygonComponent', () => {
  let fixture: ComponentFixture<GeometryPolygonHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryPolygonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryPolygonHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds polygon coordinates through Angular inputs and attaches the geometry to the feature', () => {
    expect(fixture.componentInstance.geometry.instance).toBeInstanceOf(Polygon);
    expect(fixture.componentInstance.feature.instance.getGeometry()).toBe(
      fixture.componentInstance.geometry.instance,
    );
    expect(fixture.componentInstance.geometry.instance.getCoordinates()).toEqual(
      fixture.componentInstance.coordinates,
    );
  });
});
