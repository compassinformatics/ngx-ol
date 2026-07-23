import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import LineString from 'ol/geom/LineString.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryLinestringComponent } from './geometrylinestring.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-linestring>
              <aol-collection-coordinates
                [coordinates]="coordinates"
                [srid]="srid"
              ></aol-collection-coordinates>
            </aol-geometry-linestring>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryLinestringHostComponent {
  center = [0, 0];
  zoom = 2;
  srid = 'EPSG:3857';
  coordinates = [
    [0, 0],
    [1, 2],
    [3, 4],
  ];

  readonly geometry = viewChild.required<GeometryLinestringComponent>(GeometryLinestringComponent);

  readonly feature = viewChild.required<FeatureComponent>(FeatureComponent);
}

describe('GeometryLinestringComponent', () => {
  let fixture: ComponentFixture<GeometryLinestringHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryLinestringHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryLinestringHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('attaches the bound line string geometry to its feature', () => {
    expect(fixture.componentInstance.geometry().instance).toBeInstanceOf(LineString);
    expect(fixture.componentInstance.geometry().instance.getCoordinates()).toEqual(
      fixture.componentInstance.coordinates,
    );
    expect(fixture.componentInstance.feature().instance.getGeometry()).toBe(
      fixture.componentInstance.geometry().instance,
    );
  });
});
