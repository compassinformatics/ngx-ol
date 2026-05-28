import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlZoomToExtentComponent } from './zoomtoextent.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-zoomtoextent [extent]="extent" [target]="target()"></aol-control-zoomtoextent>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlZoomToExtentHostComponent {
  center = [0, 0];
  zoom = 2;
  extent: [number, number, number, number] = [-10, -10, 10, 10];
  target = signal<string | HTMLElement | undefined>(undefined);

  @ViewChild(ControlZoomToExtentComponent)
  control!: ControlZoomToExtentComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlZoomToExtentComponent', () => {
  let fixture: ComponentFixture<ControlZoomToExtentHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlZoomToExtentHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlZoomToExtentHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a zoom-to-extent control with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });

  it('updates the target without recreating the control', () => {
    const host = fixture!.componentInstance;
    const previousControl = host.control.instance;
    const setTarget = vi.spyOn(previousControl, 'setTarget');

    host.target.set('zoom-to-extent-target');
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(setTarget).toHaveBeenCalledWith('zoom-to-extent-target');
  });
});
