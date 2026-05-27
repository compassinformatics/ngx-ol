import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ControlComponent } from './control.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control>
        <aol-content><button>Custom</button></aol-content>
      </aol-control>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlHostComponent {
  center = [0, 0];
  zoom = 2;

  @ViewChild(ControlComponent)
  control!: ControlComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ControlComponent', () => {
  let fixture: ComponentFixture<ControlHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('projects custom content into an OpenLayers control attached to the map', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const control = host.control.instance;

    expect(map.getControls().getArray()).toContain(control);
    expect(fixture!.nativeElement.textContent).toContain('Custom');

    fixture!.destroy();
    fixture = undefined;

    expect(map.getControls().getArray()).not.toContain(control);
  });
});
