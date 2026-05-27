import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlFullScreenComponent } from './fullscreen.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-fullscreen></aol-control-fullscreen>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlFullScreenHostComponent {
  center = [0, 0];
  zoom = 2;

  @ViewChild(ControlFullScreenComponent)
  control!: ControlFullScreenComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlFullScreenComponent', () => {
  let fixture: ComponentFixture<ControlFullScreenHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlFullScreenHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlFullScreenHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a fullscreen control with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });
});
