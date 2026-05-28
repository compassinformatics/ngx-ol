import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlOverviewMapComponent } from './overviewmap.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-overviewmap
        [collapsed]="collapsed()"
        [collapsible]="collapsible()"
        [rotateWithView]="rotateWithView()"
        [target]="target()"
      ></aol-control-overviewmap>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlOverviewMapHostComponent {
  center = [0, 0];
  zoom = 2;
  collapsed = signal(false);
  collapsible = signal(true);
  rotateWithView = signal(false);
  target = signal<string | HTMLElement | undefined>(undefined);

  @ViewChild(ControlOverviewMapComponent)
  control!: ControlOverviewMapComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlOverviewMapComponent', () => {
  let fixture: ComponentFixture<ControlOverviewMapHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlOverviewMapHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlOverviewMapHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes an overview map control with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });

  it('updates live overview map bindings without recreating the control', () => {
    const host = fixture!.componentInstance;
    const previousControl = host.control.instance;
    const setCollapsed = vi.spyOn(previousControl, 'setCollapsed');
    const setTarget = vi.spyOn(previousControl, 'setTarget');

    host.collapsed.set(true);
    host.collapsible.set(false);
    host.rotateWithView.set(true);
    host.target.set('overview-target');
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(host.control.instance.getCollapsible()).toBe(false);
    expect(host.control.instance.getRotateWithView()).toBe(true);
    expect(setCollapsed).toHaveBeenCalledWith(true);
    expect(setTarget).toHaveBeenCalledWith('overview-target');
  });
});
