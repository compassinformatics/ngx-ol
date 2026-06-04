import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Units } from 'ol/control/ScaleLine';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlScaleLineComponent } from './scaleline.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-scaleline [units]="units"></aol-control-scaleline>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlScaleLineHostComponent {
  center = [0, 0];
  zoom = 2;
  units: Units = 'metric';

  readonly control = viewChild.required<ControlScaleLineComponent>(ControlScaleLineComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
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
    const map = host.map().instance;
    const control = host.control().instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });
});
