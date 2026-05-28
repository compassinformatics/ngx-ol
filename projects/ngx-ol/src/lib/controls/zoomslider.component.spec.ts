import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlZoomSliderComponent } from './zoomslider.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-zoomslider [target]="target()"></aol-control-zoomslider>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlZoomSliderHostComponent {
  center = [0, 0];
  zoom = 2;
  target = signal<string | HTMLElement | undefined>(undefined);

  @ViewChild(ControlZoomSliderComponent)
  control!: ControlZoomSliderComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlZoomSliderComponent', () => {
  let fixture: ComponentFixture<ControlZoomSliderHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlZoomSliderHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlZoomSliderHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a zoom slider control with the host map lifecycle', () => {
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

    host.target.set('zoom-slider-target');
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(setTarget).toHaveBeenCalledWith('zoom-slider-target');
  });
});
