import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import MultiPoint from 'ol/geom/MultiPoint';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryMultiPointComponent } from './geometrymultipoint.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-multipoint>
              <aol-collection-coordinates [coordinates]="coordinates" [srid]="srid"></aol-collection-coordinates>
            </aol-geometry-multipoint>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryMultiPointHostComponent {
  center = [0, 0];
  zoom = 2;
  srid = 'EPSG:3857';
  coordinates = [
    [0, 0],
    [2, 2],
  ];

  @ViewChild(GeometryMultiPointComponent)
  geometry!: GeometryMultiPointComponent;

  @ViewChild(FeatureComponent)
  feature!: FeatureComponent;
}

describe('GeometryMultiPointComponent', () => {
  let fixture: ComponentFixture<GeometryMultiPointHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryMultiPointHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryMultiPointHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds multipoint coordinates through Angular inputs and attaches the geometry to the feature', () => {
    expect(fixture.componentInstance.geometry.instance).toBeInstanceOf(MultiPoint);
    expect(fixture.componentInstance.feature.instance.getGeometry()).toBe(
      fixture.componentInstance.geometry.instance,
    );
    expect(fixture.componentInstance.geometry.instance.getCoordinates()).toEqual(
      fixture.componentInstance.coordinates,
    );
  });
});
