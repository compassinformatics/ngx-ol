import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DragRotateInteractionComponent } from './dragrotate.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-dragrotate [duration]="duration"></aol-interaction-dragrotate>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DragRotateInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 100;

  readonly interaction = viewChild.required<DragRotateInteractionComponent>(
    DragRotateInteractionComponent,
  );

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('DragRotateInteractionComponent', () => {
  let fixture: ComponentFixture<DragRotateInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragRotateInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragRotateInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a drag-rotate interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const interaction = host.interaction().instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
