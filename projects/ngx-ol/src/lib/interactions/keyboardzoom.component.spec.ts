import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { KeyboardZoomInteractionComponent } from './keyboardzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-keyboardzoom [delta]="delta"></aol-interaction-keyboardzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class KeyboardZoomInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  delta = 2;

  readonly interaction = viewChild.required<KeyboardZoomInteractionComponent>(
    KeyboardZoomInteractionComponent,
  );

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('KeyboardZoomInteractionComponent', () => {
  let fixture: ComponentFixture<KeyboardZoomInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardZoomInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyboardZoomInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a keyboard-zoom interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const interaction = host.interaction().instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
