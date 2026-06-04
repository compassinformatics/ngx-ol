import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { LayerVectorComponent } from './layervector.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector
        [opacity]="opacity()"
        [postrender]="postrender()"
        [prerender]="prerender()"
        [properties]="properties()"
        [visible]="visible()"
        [zIndex]="zIndex()"
      ></aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerVectorHostComponent {
  center = [0, 0];
  zoom = 2;
  opacity = signal(0.6);
  postrender = signal(vi.fn());
  prerender = signal(vi.fn());
  properties = signal<Record<string, string>>({ name: 'roads', category: 'transport' });
  visible = signal(true);
  zIndex = signal(1);

  @ViewChild(LayerVectorComponent)
  layer!: LayerVectorComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('LayerVectorComponent', () => {
  let fixture: ComponentFixture<LayerVectorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerVectorHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerVectorHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a vector layer from template inputs', () => {
    expect(fixture.componentInstance.layer.instance.getOpacity()).toBe(0.6);
    expect(fixture.componentInstance.layer.instance.getVisible()).toBe(true);
    expect(fixture.componentInstance.layer.instance.getZIndex()).toBe(1);
    expect(fixture.componentInstance.layer.instance.get('name')).toBe('roads');
    expect(fixture.componentInstance.layer.instance.get('category')).toBe('transport');
    expect(fixture.componentInstance.map.instance.getLayers().getArray()).toContain(
      fixture.componentInstance.layer.instance,
    );
  });

  it('updates OpenLayers layer properties when template bindings change', () => {
    fixture.componentInstance.opacity.set(0.25);
    fixture.componentInstance.visible.set(false);
    fixture.componentInstance.zIndex.set(5);

    fixture.detectChanges();

    expect(fixture.componentInstance.layer.instance.getOpacity()).toBe(0.25);
    expect(fixture.componentInstance.layer.instance.getVisible()).toBe(false);
    expect(fixture.componentInstance.layer.instance.getZIndex()).toBe(5);
  });

  it('updates and removes explicit OpenLayers layer properties when bindings change', () => {
    fixture.componentInstance.properties.set({ category: 'water' });

    fixture.detectChanges();

    expect(fixture.componentInstance.layer.instance.get('name')).toBeUndefined();
    expect(fixture.componentInstance.layer.instance.get('category')).toBe('water');
  });

  it('updates render event handlers when template bindings change', () => {
    const originalPrerender = fixture.componentInstance.prerender();
    const originalPostrender = fixture.componentInstance.postrender();
    const nextPrerender = vi.fn();
    const nextPostrender = vi.fn();

    fixture.componentInstance.layer.instance.dispatchEvent('prerender');
    fixture.componentInstance.layer.instance.dispatchEvent('postrender');

    expect(originalPrerender).toHaveBeenCalledOnce();
    expect(originalPostrender).toHaveBeenCalledOnce();

    fixture.componentInstance.prerender.set(nextPrerender);
    fixture.componentInstance.postrender.set(nextPostrender);

    fixture.detectChanges();

    fixture.componentInstance.layer.instance.dispatchEvent('prerender');
    fixture.componentInstance.layer.instance.dispatchEvent('postrender');

    expect(originalPrerender).toHaveBeenCalledOnce();
    expect(originalPostrender).toHaveBeenCalledOnce();
    expect(nextPrerender).toHaveBeenCalledOnce();
    expect(nextPostrender).toHaveBeenCalledOnce();
  });
});
