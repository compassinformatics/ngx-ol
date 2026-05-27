import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { PinchRotateInteractionComponent } from './pinchrotate.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-pinchrotate [threshold]="threshold"></aol-interaction-pinchrotate>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class PinchRotateInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  threshold = 0.3;

  @ViewChild(PinchRotateInteractionComponent)
  interaction!: PinchRotateInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('PinchRotateInteractionComponent', () => {
  let fixture: ComponentFixture<PinchRotateInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinchRotateInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PinchRotateInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a pinch-rotate interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
