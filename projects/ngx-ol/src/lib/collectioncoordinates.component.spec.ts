import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fromLonLat } from 'ol/proj';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { GeometryLinestringComponent } from './geom/geometrylinestring.component';
import { GeometryMultiPolygonComponent } from './geom/geometrymultipolygon.component';
import { GeometryPolygonComponent } from './geom/geometrypolygon.component';
import { CollectionCoordinatesComponent } from './collectioncoordinates.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-polygon [srid]="srid">
              <aol-collection-coordinates
                [coordinates]="coordinates"
                [srid]="srid"
              ></aol-collection-coordinates>
            </aol-geometry-polygon>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class CollectionCoordinatesHostComponent {
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

  readonly collectionCoordinates = viewChild.required<CollectionCoordinatesComponent>(
    CollectionCoordinatesComponent,
  );

  readonly geometry = viewChild.required<GeometryPolygonComponent>(GeometryPolygonComponent);
}

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [projection]="projection()" [zoom]="zoom"></aol-view>
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
class LinestringCollectionCoordinatesHostComponent {
  center = [0, 0];
  projection = signal('EPSG:3857');
  zoom = 2;
  srid = 'EPSG:4326';
  coordinates = [
    [0, 0],
    [1, 1],
  ];

  readonly geometry = viewChild.required<GeometryLinestringComponent>(GeometryLinestringComponent);
}

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
class MultiPolygonCollectionCoordinatesHostComponent {
  center = [0, 0];
  zoom = 2;
  srid = 'EPSG:4326';
  coordinates = [
    [
      [
        [0, 0],
        [1, 1],
        [0, 1],
      ],
    ],
  ];

  readonly geometry = viewChild.required<GeometryMultiPolygonComponent>(
    GeometryMultiPolygonComponent,
  );
}

describe('CollectionCoordinatesComponent', () => {
  let fixture: ComponentFixture<CollectionCoordinatesHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CollectionCoordinatesHostComponent,
        LinestringCollectionCoordinatesHostComponent,
        MultiPolygonCollectionCoordinatesHostComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionCoordinatesHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('projects nested coordinate arrays into the host geometry', () => {
    expect(fixture.componentInstance.geometry().instance.getCoordinates()).toEqual(
      fixture.componentInstance.coordinates,
    );
  });

  it('transforms line string coordinates into the map projection', () => {
    const linestringFixture = TestBed.createComponent(LinestringCollectionCoordinatesHostComponent);
    linestringFixture.detectChanges();
    const coordinates = linestringFixture.componentInstance.geometry().instance.getCoordinates();

    expect(coordinates[0]).toEqual(fromLonLat([0, 0]));
    expect(coordinates[1][0]).toBeCloseTo(fromLonLat([1, 1])[0]);
    expect(coordinates[1][1]).toBeCloseTo(fromLonLat([1, 1])[1]);

    linestringFixture.destroy();
  });

  it('reprojects coordinates when the map view projection changes', () => {
    const linestringFixture = TestBed.createComponent(LinestringCollectionCoordinatesHostComponent);
    linestringFixture.detectChanges();

    linestringFixture.componentInstance.projection.set('EPSG:4326');

    linestringFixture.detectChanges();

    expect(linestringFixture.componentInstance.geometry().instance.getCoordinates()).toEqual(
      linestringFixture.componentInstance.coordinates,
    );

    linestringFixture.destroy();
  });

  it('transforms multi-polygon coordinates into the map projection', () => {
    const multiPolygonFixture = TestBed.createComponent(
      MultiPolygonCollectionCoordinatesHostComponent,
    );
    multiPolygonFixture.detectChanges();
    const coordinates = multiPolygonFixture.componentInstance.geometry().instance.getCoordinates();
    const expected = fromLonLat([1, 1]);

    expect(coordinates[0][0][1][0]).toBeCloseTo(expected[0]);
    expect(coordinates[0][0][1][1]).toBeCloseTo(expected[1]);

    multiPolygonFixture.destroy();
  });
});
