import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import GeoJSON from 'ol/format/GeoJSON.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DragAndDropInteractionComponent } from './draganddrop.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-draganddrop
        [formatConstructors]="formats"
        [projection]="projection"
      ></aol-interaction-draganddrop>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DragAndDropInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  formats = [new GeoJSON()];
  projection = 'EPSG:4326';

  readonly interaction = viewChild.required<DragAndDropInteractionComponent>(
    DragAndDropInteractionComponent,
  );

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('DragAndDropInteractionComponent', () => {
  let fixture: ComponentFixture<DragAndDropInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragAndDropInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a drag-and-drop interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const interaction = host.interaction().instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
