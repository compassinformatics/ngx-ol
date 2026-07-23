import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceVectorComponent } from './vector.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector [features]="features()"></aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceVectorHostComponent {
  center = [0, 0];
  zoom = 2;
  features = signal<Feature[] | undefined>([new Feature(new Point([1, 2]))]);

  readonly source = viewChild.required<SourceVectorComponent>(SourceVectorComponent);

  readonly layer = viewChild.required<LayerVectorComponent>(LayerVectorComponent);
}

describe('SourceVectorComponent', () => {
  let fixture: ComponentFixture<SourceVectorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceVectorHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceVectorHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds a vector source into the vector layer through template inputs', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
    expect(fixture.componentInstance.source().instance.getFeatures()).toHaveLength(1);
  });

  it('clears existing features when the features binding is cleared', () => {
    fixture.componentInstance.features.set(undefined);

    fixture.detectChanges();

    expect(fixture.componentInstance.source().instance.getFeatures()).toHaveLength(0);
  });
});
