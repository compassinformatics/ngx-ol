import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlOverviewMapComponent } from './overviewmap.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-overviewmap [collapsed]="collapsed"></aol-control-overviewmap>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlOverviewMapHostComponent {
  center = [0, 0];
  zoom = 2;
  collapsed = false;

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
});
