import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import { FeatureLoader } from 'ol/featureloader';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorComponent } from '../layers/layervector.component';
import { SourceVectorComponent } from './vector.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector
          [features]="features()"
          [url]="url()"
          [format]="format"
          [loader]="loader()"
        ></aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceVectorHostComponent {
  center = [0, 0];
  zoom = 2;
  features = signal([new Feature(new Point([1, 2]))]);
  url = signal<string | undefined>(undefined);
  format = new GeoJSON();
  loader = signal<FeatureLoader<FeatureLike> | undefined>(undefined);

  @ViewChild(SourceVectorComponent)
  source!: SourceVectorComponent;

  @ViewChild(LayerVectorComponent)
  layer!: LayerVectorComponent;
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
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getFeatures()).toHaveLength(1);
  });

  it('updates live vector source bindings without recreating the source', () => {
    const host = fixture.componentInstance;
    const previousSource = host.source.instance;
    const loader: FeatureLoader<FeatureLike> = vi.fn();
    const setLoader = vi.spyOn(previousSource, 'setLoader');

    host.features.set([new Feature(new Point([3, 4])), new Feature(new Point([5, 6]))]);
    host.url.set('https://example.com/features.geojson');
    host.loader.set(loader);
    fixture.detectChanges();

    expect(host.source.instance).toBe(previousSource);
    expect(host.layer.instance.getSource()).toBe(previousSource);
    expect(host.source.instance.getFeatures()).toHaveLength(2);
    expect(host.source.instance.getUrl()).toBe('https://example.com/features.geojson');
    expect(setLoader).toHaveBeenCalledWith(loader);
  });
});
