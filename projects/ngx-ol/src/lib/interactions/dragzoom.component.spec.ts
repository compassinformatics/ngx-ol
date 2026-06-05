import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DragZoomInteractionComponent } from './dragzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-dragzoom [duration]="duration"></aol-interaction-dragzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DragZoomInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 100;

  readonly interaction = viewChild.required<DragZoomInteractionComponent>(
    DragZoomInteractionComponent,
  );

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('DragZoomInteractionComponent', () => {
  let fixture: ComponentFixture<DragZoomInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragZoomInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragZoomInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a drag-zoom interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const interaction = host.interaction().instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
