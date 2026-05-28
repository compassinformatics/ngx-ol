import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlAttributionComponent } from './attribution.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-attribution
        [collapsed]="collapsed()"
        [collapsible]="collapsible()"
      ></aol-control-attribution>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlAttributionHostComponent {
  center = [0, 0];
  zoom = 2;
  collapsed = signal(false);
  collapsible = signal(true);

  @ViewChild(ControlAttributionComponent)
  control!: ControlAttributionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlAttributionComponent', () => {
  let fixture: ComponentFixture<ControlAttributionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlAttributionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlAttributionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes an attribution control with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });

  it('updates collapsible state without recreating the control', () => {
    const host = fixture!.componentInstance;
    const previousControl = host.control.instance;
    const setCollapsed = vi.spyOn(previousControl, 'setCollapsed');

    host.collapsed.set(true);
    host.collapsible.set(false);
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(host.control.instance.getCollapsible()).toBe(false);
    expect(setCollapsed).toHaveBeenCalledWith(true);
  });
});
