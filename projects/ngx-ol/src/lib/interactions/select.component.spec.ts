import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { SelectInteractionComponent } from './select.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-select
        [features]="features"
        [multi]="multi"
        (olSelect)="select($event)"
        (olChange)="change($event)"
        (changeActive)="changeActive($event)"
        (olError)="error($event)"
        (propertyChange)="propertyChange($event)"
      ></aol-interaction-select>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SelectInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  multi = true;
  features = new Collection([new Feature()]);
  select = vi.fn();
  change = vi.fn();
  changeActive = vi.fn();
  error = vi.fn();
  propertyChange = vi.fn();

  readonly interaction = viewChild.required<SelectInteractionComponent>(SelectInteractionComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('SelectInteractionComponent', () => {
  let fixture: ComponentFixture<SelectInteractionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds a select interaction to the map and forwards OpenLayers events', () => {
    const host = fixture.componentInstance;

    expect(host.map().instance.getInteractions().getArray()).toContain(host.interaction().instance);

    host.interaction().instance.dispatchEvent('select');
    host.interaction().instance.dispatchEvent('change');
    host.interaction().instance.dispatchEvent('change:active');
    host.interaction().instance.dispatchEvent('error');
    host.interaction().instance.dispatchEvent('propertychange');

    expect(host.select).toHaveBeenCalledOnce();
    expect(host.change).toHaveBeenCalledOnce();
    expect(host.changeActive).toHaveBeenCalledOnce();
    expect(host.error).toHaveBeenCalledOnce();
    expect(host.propertyChange).toHaveBeenCalledOnce();
  });
});
