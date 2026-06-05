import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlRotateComponent } from './rotate.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-rotate [autoHide]="autoHide"></aol-control-rotate>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlRotateHostComponent {
  center = [0, 0];
  zoom = 2;
  autoHide = false;

  readonly control = viewChild.required<ControlRotateComponent>(ControlRotateComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
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
    const map = host.map().instance;
    const control = host.control().instance;

    expect(map.getControls().getArray()).toContain(control);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });
});
