import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Point from 'ol/geom/Point';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryPointComponent } from './geometrypoint.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-point>
              <aol-coordinate [x]="x" [y]="y" [srid]="srid"></aol-coordinate>
            </aol-geometry-point>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryPointHostComponent {
  center = [0, 0];
  zoom = 2;
  x = 1;
  y = 2;
  srid = 'EPSG:3857';

  readonly geometry = viewChild.required<GeometryPointComponent>(GeometryPointComponent);

  readonly feature = viewChild.required<FeatureComponent>(FeatureComponent);
}

describe('GeometryPointComponent', () => {
  let fixture: ComponentFixture<GeometryPointHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryPointHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryPointHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('attaches the bound point geometry to its feature', () => {
    expect(fixture.componentInstance.geometry().instance).toBeInstanceOf(Point);
    expect(fixture.componentInstance.geometry().instance.getCoordinates()).toEqual([1, 2]);
    expect(fixture.componentInstance.feature().instance.getGeometry()).toBe(
      fixture.componentInstance.geometry().instance,
    );
  });
});
