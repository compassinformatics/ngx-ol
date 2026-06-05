import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlZoomToExtentComponent } from './zoomtoextent.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-zoomtoextent [extent]="extent"></aol-control-zoomtoextent>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlZoomToExtentHostComponent {
  center = [0, 0];
  zoom = 2;
  extent: [number, number, number, number] = [-10, -10, 10, 10];

  readonly control = viewChild.required<ControlZoomToExtentComponent>(ControlZoomToExtentComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
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
    const map = host.map().instance;
    const control = host.control().instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });
});
