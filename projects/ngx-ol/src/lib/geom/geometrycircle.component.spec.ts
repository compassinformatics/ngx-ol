import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Circle from 'ol/geom/Circle.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { GeometryCircleComponent } from './geometrycircle.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="mapCenter" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-geometry-circle [center]="center" [radius]="radius"></aol-geometry-circle>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GeometryCircleHostComponent {
  mapCenter = [0, 0];
  zoom = 2;
  center = [5, 6];
  radius = 10;

  readonly geometry = viewChild.required<GeometryCircleComponent>(GeometryCircleComponent);

  readonly feature = viewChild.required<FeatureComponent>(FeatureComponent);
}

describe('GeometryCircleComponent', () => {
  let fixture: ComponentFixture<GeometryCircleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryCircleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryCircleHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds center and radius through Angular inputs and attaches the geometry to the feature', () => {
    expect(fixture.componentInstance.geometry().instance).toBeInstanceOf(Circle);
    expect(fixture.componentInstance.feature().instance.getGeometry()).toBe(
      fixture.componentInstance.geometry().instance,
    );
    expect(fixture.componentInstance.geometry().instance.getCenter()).toEqual([5, 6]);
    expect(fixture.componentInstance.geometry().instance.getRadius()).toBe(10);
  });
});
