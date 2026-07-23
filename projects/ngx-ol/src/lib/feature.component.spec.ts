import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { SourceVectorComponent } from './sources/vector.component';
import { FeatureComponent } from './feature.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature
            [feature]="feature()"
            [id]="id()"
            [properties]="properties()"
            [clickable]="clickable()"
          ></aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class FeatureHostComponent {
  center = [0, 0];
  zoom = 2;
  feature = signal(new Feature());
  id = signal('feature-1');
  properties = signal<Record<string, string>>({ name: 'test' });
  clickable = signal(true);

  readonly featureComponent = viewChild.required<FeatureComponent>(FeatureComponent);

  readonly source = viewChild.required<SourceVectorComponent>(SourceVectorComponent);
}

describe('FeatureComponent', () => {
  let fixture: ComponentFixture<FeatureHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds the bound feature to the vector source and applies metadata', () => {
    expect(fixture.componentInstance.source().instance.getFeatures()).toContain(
      fixture.componentInstance.feature(),
    );
    expect(fixture.componentInstance.feature().getId()).toBe('feature-1');
    expect(fixture.componentInstance.feature().get('name')).toBe('test');
    expect(fixture.componentInstance.feature().get('__aol-feature')).toBe(
      fixture.componentInstance.featureComponent(),
    );
  });

  it('updates feature id and clickable metadata from template bindings', () => {
    fixture.componentInstance.id.set('feature-2');
    fixture.componentInstance.clickable.set(false);

    fixture.detectChanges();

    expect(fixture.componentInstance.feature().getId()).toBe('feature-2');
    expect(fixture.componentInstance.feature().get('__aol-feature')).toBeNull();

    fixture.componentInstance.clickable.set(true);

    fixture.detectChanges();

    expect(fixture.componentInstance.feature().get('__aol-feature')).toBe(
      fixture.componentInstance.featureComponent(),
    );
  });

  it('updates and removes feature properties when template bindings change', () => {
    fixture.componentInstance.properties.set({ name: 'updated', category: 'road' });

    fixture.detectChanges();

    expect(fixture.componentInstance.feature().get('name')).toBe('updated');
    expect(fixture.componentInstance.feature().get('category')).toBe('road');

    fixture.componentInstance.properties.set({ category: 'river' });

    fixture.detectChanges();

    expect(fixture.componentInstance.feature().get('name')).toBeUndefined();
    expect(fixture.componentInstance.feature().get('category')).toBe('river');
  });

  it('replaces the OpenLayers feature in the vector source when the binding changes', () => {
    const previousFeature = fixture.componentInstance.feature();
    const nextFeature = new Feature();

    fixture.componentInstance.feature.set(nextFeature);

    fixture.detectChanges();

    expect(fixture.componentInstance.source().instance.getFeatures()).not.toContain(
      previousFeature,
    );
    expect(fixture.componentInstance.source().instance.getFeatures()).toContain(nextFeature);
    expect(previousFeature.get('__aol-feature')).toBeNull();
    expect(nextFeature.get('__aol-feature')).toBe(fixture.componentInstance.featureComponent());
    expect(nextFeature.getId()).toBe('feature-1');
    expect(nextFeature.get('name')).toBe('test');
  });
});
