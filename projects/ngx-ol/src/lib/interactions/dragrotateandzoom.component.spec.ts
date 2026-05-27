import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DragRotateAndZoomInteractionComponent } from './dragrotateandzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-dragrotateandzoom
        [duration]="duration"
      ></aol-interaction-dragrotateandzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DragRotateAndZoomInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 100;

  @ViewChild(DragRotateAndZoomInteractionComponent)
  interaction!: DragRotateAndZoomInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('DragRotateAndZoomInteractionComponent', () => {
  let fixture: ComponentFixture<DragRotateAndZoomInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragRotateAndZoomInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragRotateAndZoomInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a drag-rotate-and-zoom interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
