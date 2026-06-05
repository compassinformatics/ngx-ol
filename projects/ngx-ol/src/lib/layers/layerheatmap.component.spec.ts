import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { LayerHeatmapComponent } from './layerheatmap.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-heatmap
        [blur]="blur()"
        [gradient]="gradient()"
        [radius]="radius()"
      ></aol-layer-heatmap>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerHeatmapHostComponent {
  center = [0, 0];
  zoom = 2;
  blur = signal(12);
  gradient = signal(['#000000', '#ffffff']);
  radius = signal(8);

  readonly layer = viewChild.required<LayerHeatmapComponent>(LayerHeatmapComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('LayerHeatmapComponent', () => {
  let fixture: ComponentFixture<LayerHeatmapHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerHeatmapHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerHeatmapHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('creates a heatmap layer from template inputs', () => {
    const host = fixture!.componentInstance;

    expect(host.layer().instance.getBlur()).toBe(12);
    expect(host.layer().instance.getGradient()).toEqual(['#000000', '#ffffff']);
    expect(host.layer().instance.getRadius()).toBe(8);
    expect(host.map().instance.getLayers().getArray()).toContain(host.layer().instance);
  });

  it('updates and removes the OpenLayers heatmap layer through bindings and lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const layer = host.layer().instance;

    host.blur.set(16);
    host.gradient.set(['#ff0000', '#00ff00']);
    host.radius.set(12);

    fixture!.detectChanges();

    expect(layer.getBlur()).toBe(16);
    expect(layer.getGradient()).toEqual(['#ff0000', '#00ff00']);
    expect(layer.getRadius()).toBe(12);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getLayers().getArray()).not.toContain(layer);
  });
});
