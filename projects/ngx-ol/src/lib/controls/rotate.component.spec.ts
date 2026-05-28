import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlRotateComponent } from './rotate.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-rotate [autoHide]="autoHide" [target]="target()"></aol-control-rotate>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlRotateHostComponent {
  center = [0, 0];
  zoom = 2;
  autoHide = false;
  target = signal<string | HTMLElement | undefined>(undefined);

  @ViewChild(ControlRotateComponent)
  control!: ControlRotateComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlRotateComponent', () => {
  let fixture: ComponentFixture<ControlRotateHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlRotateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlRotateHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a rotate control with the host map lifecycle', () => {
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

    host.target.set('rotate-target');
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(setTarget).toHaveBeenCalledWith('rotate-target');
  });
});
