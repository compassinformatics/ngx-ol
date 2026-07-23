import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import MultiPolygon from 'ol/geom/MultiPolygon.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryMultiPolygonComponent } from './geometrymultipolygon.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-multipolygon>
              <aol-collection-coordinates
                [coordinates]="coordinates"
                [srid]="srid"
              ></aol-collection-coordinates>
            </aol-geometry-multipolygon>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryMultiPolygonHostComponent {
  center = [0, 0];
  zoom = 2;
  srid = 'EPSG:3857';
  coordinates = [
    [
      [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 0],
      ],
    ],
  ];

  readonly geometry = viewChild.required<GeometryMultiPolygonComponent>(
    GeometryMultiPolygonComponent,
  );

  readonly feature = viewChild.required<FeatureComponent>(FeatureComponent);
}

describe('GeometryMultiPolygonComponent', () => {
  let fixture: ComponentFixture<GeometryMultiPolygonHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryMultiPolygonHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryMultiPolygonHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('attaches the bound multi-polygon geometry to its feature', () => {
    expect(fixture.componentInstance.geometry().instance).toBeInstanceOf(MultiPolygon);
    expect(fixture.componentInstance.geometry().instance.getCoordinates()).toEqual(
      fixture.componentInstance.coordinates,
    );
    expect(fixture.componentInstance.feature().instance.getGeometry()).toBe(
      fixture.componentInstance.geometry().instance,
    );
  });
});
