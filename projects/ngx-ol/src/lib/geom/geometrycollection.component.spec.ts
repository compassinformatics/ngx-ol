import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import GeometryCollection from 'ol/geom/GeometryCollection.js';
import Point from 'ol/geom/Point.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryCollectionComponent } from './geometrycollection.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-collection [geometries]="geometries"></aol-geometry-collection>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryCollectionHostComponent {
  center = [0, 0];
  zoom = 2;
  geometries = [new Point([1, 2]), new Point([3, 4])];

  readonly geometry = viewChild.required<GeometryCollectionComponent>(GeometryCollectionComponent);

  readonly feature = viewChild.required<FeatureComponent>(FeatureComponent);
}

describe('GeometryCollectionComponent', () => {
  let fixture: ComponentFixture<GeometryCollectionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryCollectionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryCollectionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('attaches the bound geometry collection to its feature', () => {
    expect(fixture.componentInstance.geometry().instance).toBeInstanceOf(GeometryCollection);
    expect(
      fixture.componentInstance
        .geometry()
        .instance.getGeometries()
        .map((geometry) => (geometry as any).getCoordinates()),
    ).toEqual(
      fixture.componentInstance.geometries.map((geometry) => (geometry as any).getCoordinates()),
    );
    expect(fixture.componentInstance.feature().instance.getGeometry()).toBe(
      fixture.componentInstance.geometry().instance,
    );
  });
});
