import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import MultiLineString from 'ol/geom/MultiLineString';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryMultiLinestringComponent } from './geometrymultilinestring.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-multilinestring>
              <aol-collection-coordinates [coordinates]="coordinates" [srid]="srid"></aol-collection-coordinates>
            </aol-geometry-multilinestring>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryMultiLinestringHostComponent {
  center = [0, 0];
  zoom = 2;
  srid = 'EPSG:3857';
  coordinates = [
    [
      [0, 0],
      [1, 2],
    ],
    [
      [3, 4],
      [5, 6],
    ],
  ];

  @ViewChild(GeometryMultiLinestringComponent)
  geometry!: GeometryMultiLinestringComponent;

  @ViewChild(FeatureComponent)
  feature!: FeatureComponent;
}

describe('GeometryMultiLinestringComponent', () => {
  let fixture: ComponentFixture<GeometryMultiLinestringHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryMultiLinestringHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryMultiLinestringHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('attaches the bound multi-line string geometry to its feature', () => {
    expect(fixture.componentInstance.geometry.instance).toBeInstanceOf(MultiLineString);
    expect(fixture.componentInstance.geometry.instance.getCoordinates()).toEqual(
      fixture.componentInstance.coordinates,
    );
    expect(fixture.componentInstance.feature.instance.getGeometry()).toBe(
      fixture.componentInstance.geometry.instance,
    );
  });
});
