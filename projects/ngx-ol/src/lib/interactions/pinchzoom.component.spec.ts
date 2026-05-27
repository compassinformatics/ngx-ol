import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { PinchZoomInteractionComponent } from './pinchzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-pinchzoom [duration]="duration"></aol-interaction-pinchzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class PinchZoomInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 100;

  @ViewChild(PinchZoomInteractionComponent)
  interaction!: PinchZoomInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('PinchZoomInteractionComponent', () => {
  let fixture: ComponentFixture<PinchZoomInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinchZoomInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PinchZoomInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a pinch-zoom interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
