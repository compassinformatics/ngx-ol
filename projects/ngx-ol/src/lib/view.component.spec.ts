import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { MapComponent } from './map.component';
import { ViewComponent } from './view.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view
        [center]="center()"
        [maxZoom]="maxZoom()"
        [minZoom]="minZoom()"
        [projection]="projection()"
        [resolution]="resolution()"
        [rotation]="rotation()"
        [zoom]="zoom()"
        [zoomAnimation]="zoomAnimation()"
        (olChange)="change($event)"
        (changeCenter)="centerChanged($event)"
        (changeResolution)="resolutionChanged($event)"
        (changeRotation)="rotationChanged($event)"
        (olError)="error($event)"
        (propertyChange)="propertyChange($event)"
      ></aol-view>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ViewHostComponent {
  center = signal<[number, number]>([10, 20]);
  maxZoom = signal(20);
  minZoom = signal(0);
  projection = signal('EPSG:3857');
  resolution = signal<number | undefined>(undefined);
  rotation = signal(0);
  zoom = signal(3);
  zoomAnimation = signal(false);
  change = vi.fn();
  centerChanged = vi.fn();
  resolutionChanged = vi.fn();
  rotationChanged = vi.fn();
  error = vi.fn();
  propertyChange = vi.fn();

  @ViewChild(ViewComponent)
  view!: ViewComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ViewComponent', () => {
  let fixture: ComponentFixture<ViewHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a view from template bindings and attaches it to the map', () => {
    expect(fixture.componentInstance.map.instance.getView()).toBe(
      fixture.componentInstance.view.instance,
    );
    expect(fixture.componentInstance.view.instance.getZoom()).toBe(3);
    expect(fixture.componentInstance.view.instance.getCenter()).toEqual([10, 20]);
  });

  it('updates OpenLayers view state when template bindings change', () => {
    fixture.componentInstance.center.set([30, 40]);
    fixture.componentInstance.zoom.set(5);

    fixture.detectChanges();

    expect(fixture.componentInstance.view.instance.getCenter()).toEqual([30, 40]);
    expect(fixture.componentInstance.view.instance.getZoom()).toBe(5);
  });

  it('recreates and reattaches the OpenLayers view when projection changes', () => {
    const previousView = fixture.componentInstance.view.instance;

    fixture.componentInstance.projection.set('EPSG:4326');

    fixture.detectChanges();

    expect(fixture.componentInstance.view.instance).not.toBe(previousView);
    expect(fixture.componentInstance.view.instance.getProjection().getCode()).toBe('EPSG:4326');
    expect(fixture.componentInstance.map.instance.getView()).toBe(
      fixture.componentInstance.view.instance,
    );
  });

  it('animates zoom changes when zoom animation is enabled', () => {
    const animate = vi.spyOn(fixture.componentInstance.view.instance, 'animate');

    fixture.componentInstance.zoomAnimation.set(true);
    fixture.componentInstance.zoom.set(6);

    fixture.detectChanges();

    expect(animate).toHaveBeenCalledWith({ zoom: 6 });
  });

  it('updates OpenLayers view constraints and state from specialized bindings', () => {
    fixture.componentInstance.maxZoom.set(12);
    fixture.componentInstance.minZoom.set(1);
    fixture.componentInstance.resolution.set(4);
    fixture.componentInstance.rotation.set(0.5);

    fixture.detectChanges();

    expect(fixture.componentInstance.view.instance.getMaxZoom()).toBe(12);
    expect(fixture.componentInstance.view.instance.getMinZoom()).toBe(1);
    expect(fixture.componentInstance.view.instance.getResolution()).toBe(4);
    expect(fixture.componentInstance.view.instance.getRotation()).toBe(0.5);
  });

  it('forwards OpenLayers view events through template outputs', () => {
    fixture.componentInstance.view.instance.dispatchEvent('change');
    fixture.componentInstance.view.instance.dispatchEvent('change:center');
    fixture.componentInstance.view.instance.dispatchEvent('change:resolution');
    fixture.componentInstance.view.instance.dispatchEvent('change:rotation');
    fixture.componentInstance.view.instance.dispatchEvent('error');
    fixture.componentInstance.view.instance.dispatchEvent('propertychange');

    expect(fixture.componentInstance.change).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.centerChanged).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.resolutionChanged).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.rotationChanged).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.error).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.propertyChange).toHaveBeenCalledOnce();
  });
});
