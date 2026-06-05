import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DefaultControlComponent } from './default.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-defaults [zoom]="showZoom" [rotate]="showRotate"></aol-control-defaults>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DefaultControlHostComponent {
  center = [0, 0];
  zoom = 2;
  showZoom = true;
  showRotate = true;

  readonly control = viewChild.required<DefaultControlComponent>(DefaultControlComponent);

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('DefaultControlComponent', () => {
  let fixture: ComponentFixture<DefaultControlHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultControlHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultControlHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes the default controls collection with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const controls = host.control().instance.getArray();

    expect(controls.length).toBeGreaterThan(0);
    controls.forEach((control) => {
      expect(map.getControls().getArray()).toContain(control);
    });

    fixture!.destroy();
    fixture = undefined;

    controls.forEach((control) => {
      expect(map.getControls().getArray()).not.toContain(control);
    });
  });
});
