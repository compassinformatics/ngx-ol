import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { LayerGroupComponent } from './layergroup.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-group [opacity]="opacity()">
        <aol-layer-tile></aol-layer-tile>
      </aol-layer-group>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerGroupHostComponent {
  center = [0, 0];
  zoom = 2;
  opacity = signal(0.7);

  readonly layerGroup = viewChild.required<LayerGroupComponent>(LayerGroupComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('LayerGroupComponent', () => {
  let fixture: ComponentFixture<LayerGroupHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerGroupHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerGroupHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('creates a layer group from template inputs', () => {
    const host = fixture!.componentInstance;

    expect(host.layerGroup().instance.getOpacity()).toBe(0.7);
    expect(host.layerGroup().instance.getLayers().getLength()).toBe(1);
    expect(host.map().instance.getLayers().getArray()).toContain(host.layerGroup().instance);
  });

  it('updates and removes the OpenLayers group through Angular bindings and lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const layerGroup = host.layerGroup().instance;

    host.opacity.set(0.4);
    fixture!.detectChanges();

    expect(layerGroup.getOpacity()).toBe(0.4);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getLayers().getArray()).not.toContain(layerGroup);
  });
});
