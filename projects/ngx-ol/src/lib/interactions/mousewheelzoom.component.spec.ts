import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { MouseWheelZoomInteractionComponent } from './mousewheelzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-mousewheelzoom
        [duration]="duration"
      ></aol-interaction-mousewheelzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class MouseWheelZoomInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 100;

  @ViewChild(MouseWheelZoomInteractionComponent)
  interaction!: MouseWheelZoomInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('MouseWheelZoomInteractionComponent', () => {
  let fixture: ComponentFixture<MouseWheelZoomInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouseWheelZoomInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MouseWheelZoomInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a mouse-wheel zoom interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
