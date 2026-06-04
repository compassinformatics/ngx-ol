import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ModifyInteractionComponent } from './modify.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-modify
        [features]="features"
        [pixelTolerance]="pixelTolerance"
        (modifyStart)="modifyStart($event)"
        (modifyEnd)="modifyEnd($event)"
        (olChange)="change($event)"
        (changeActive)="changeActive($event)"
        (olError)="error($event)"
        (propertyChange)="propertyChange($event)"
      ></aol-interaction-modify>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ModifyInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  pixelTolerance = 5;
  features = new Collection([new Feature()]);
  modifyStart = vi.fn();
  modifyEnd = vi.fn();
  change = vi.fn();
  changeActive = vi.fn();
  error = vi.fn();
  propertyChange = vi.fn();

  readonly interaction = viewChild.required<ModifyInteractionComponent>(ModifyInteractionComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('ModifyInteractionComponent', () => {
  let fixture: ComponentFixture<ModifyInteractionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds a modify interaction to the map and forwards OpenLayers events', () => {
    const host = fixture.componentInstance;

    expect(host.map().instance.getInteractions().getArray()).toContain(host.interaction().instance);

    host.interaction().instance.dispatchEvent('modifystart');
    host.interaction().instance.dispatchEvent('modifyend');
    host.interaction().instance.dispatchEvent('change');
    host.interaction().instance.dispatchEvent('change:active');
    host.interaction().instance.dispatchEvent('error');
    host.interaction().instance.dispatchEvent('propertychange');

    expect(host.modifyStart).toHaveBeenCalledOnce();
    expect(host.modifyEnd).toHaveBeenCalledOnce();
    expect(host.change).toHaveBeenCalledOnce();
    expect(host.changeActive).toHaveBeenCalledOnce();
    expect(host.error).toHaveBeenCalledOnce();
    expect(host.propertyChange).toHaveBeenCalledOnce();
  });
});
