import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Units } from 'ol/control/ScaleLine';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlScaleLineComponent } from './scaleline.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-scaleline
        [units]="units()"
        [dpi]="dpi()"
        [target]="target()"
      ></aol-control-scaleline>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlScaleLineHostComponent {
  center = [0, 0];
  zoom = 2;
  units = signal<Units>('metric');
  dpi = signal<number | undefined>(undefined);
  target = signal<string | HTMLElement | undefined>(undefined);

  @ViewChild(ControlScaleLineComponent)
  control!: ControlScaleLineComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlScaleLineComponent', () => {
  let fixture: ComponentFixture<ControlScaleLineHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlScaleLineHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlScaleLineHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a scale line control with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });

  it('updates live scale line bindings without recreating the control', () => {
    const host = fixture!.componentInstance;
    const previousControl = host.control.instance;
    const setDpi = vi.spyOn(previousControl, 'setDpi');
    const setTarget = vi.spyOn(previousControl, 'setTarget');

    host.units.set('imperial');
    host.dpi.set(120);
    host.target.set('scale-target');
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(host.control.instance.getUnits()).toBe('imperial');
    expect(setDpi).toHaveBeenCalledWith(120);
    expect(setTarget).toHaveBeenCalledWith('scale-target');
  });
});
