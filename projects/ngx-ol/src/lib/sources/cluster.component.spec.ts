import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorImageComponent } from '../layers/layervectorimage.component';
import { SourceClusterComponent } from './cluster.component';
import { SourceVectorComponent } from './vector.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectorimage>
        <aol-source-cluster [distance]="distance">
          <aol-source-vector [features]="features"></aol-source-vector>
        </aol-source-cluster>
      </aol-layer-vectorimage>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceClusterHostComponent {
  center = [0, 0];
  zoom = 2;
  distance = 20;
  features = [new Feature(new Point([0, 0]))];

  readonly cluster = viewChild.required<SourceClusterComponent>(SourceClusterComponent);

  readonly vectorSource = viewChild.required<SourceVectorComponent>(SourceVectorComponent);

  readonly layer = viewChild.required<LayerVectorImageComponent>(LayerVectorImageComponent);
}

describe('SourceClusterComponent', () => {
  let fixture: ComponentFixture<SourceClusterHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceClusterHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceClusterHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds the nested vector source into the cluster source through the template', () => {
    expect(fixture.componentInstance.cluster().instance.getSource()).toBe(
      fixture.componentInstance.vectorSource().instance,
    );
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.cluster().instance,
    );
    expect(fixture.componentInstance.cluster().instance.getDistance()).toBe(20);
  });
});
