import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoordinateFormat } from 'ol/coordinate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlMousePositionComponent } from './mouseposition.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-mouseposition
        [projection]="projection()"
        [coordinateFormat]="coordinateFormat()"
      ></aol-control-mouseposition>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlMousePositionHostComponent {
  center = [0, 0];
  zoom = 2;
  projection = signal('EPSG:4326');
  coordinateFormat = signal<CoordinateFormat | undefined>(undefined);

  @ViewChild(ControlMousePositionComponent)
  control!: ControlMousePositionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlMousePositionComponent', () => {
  let fixture: ComponentFixture<ControlMousePositionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlMousePositionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlMousePositionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a mouse position control with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(control.getProjection()?.getCode()).toBe('EPSG:4326');
    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });

  it('updates live mouse position bindings without recreating the control', () => {
    const host = fixture!.componentInstance;
    const previousControl = host.control.instance;
    const coordinateFormat: CoordinateFormat = (coordinate) => coordinate?.join(', ') ?? '';

    host.projection.set('EPSG:3857');
    host.coordinateFormat.set(coordinateFormat);
    fixture!.detectChanges();

    expect(host.control.instance).toBe(previousControl);
    expect(host.control.instance.getProjection()?.getCode()).toBe('EPSG:3857');
    expect(host.control.instance.getCoordinateFormat()).toBe(coordinateFormat);
  });
});
