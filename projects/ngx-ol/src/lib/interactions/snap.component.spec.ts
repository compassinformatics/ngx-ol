import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { SnapInteractionComponent } from './snap.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-snap
        [features]="features"
        [pixelTolerance]="pixelTolerance"
        (snap)="snap($event)"
        (olChange)="change($event)"
        (changeActive)="changeActive($event)"
        (olError)="error($event)"
        (propertyChange)="propertyChange($event)"
      ></aol-interaction-snap>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SnapInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  pixelTolerance = 8;
  features = new Collection([new Feature()]);
  snap = vi.fn();
  change = vi.fn();
  changeActive = vi.fn();
  error = vi.fn();
  propertyChange = vi.fn();

  @ViewChild(SnapInteractionComponent)
  interaction!: SnapInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('SnapInteractionComponent', () => {
  let fixture: ComponentFixture<SnapInteractionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SnapInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds a snap interaction to the map and forwards OpenLayers events', () => {
    const host = fixture.componentInstance;

    expect(host.map.instance.getInteractions().getArray()).toContain(host.interaction.instance);

    host.interaction.instance.dispatchEvent('snap');
    host.interaction.instance.dispatchEvent('change');
    host.interaction.instance.dispatchEvent('change:active');
    host.interaction.instance.dispatchEvent('error');
    host.interaction.instance.dispatchEvent('propertychange');

    expect(host.snap).toHaveBeenCalledOnce();
    expect(host.change).toHaveBeenCalledOnce();
    expect(host.changeActive).toHaveBeenCalledOnce();
    expect(host.error).toHaveBeenCalledOnce();
    expect(host.propertyChange).toHaveBeenCalledOnce();
  });
});
