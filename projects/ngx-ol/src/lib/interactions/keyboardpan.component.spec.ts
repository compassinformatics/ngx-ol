import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { KeyboardPanInteractionComponent } from './keyboardpan.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-keyboardpan [pixelDelta]="pixelDelta"></aol-interaction-keyboardpan>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class KeyboardPanInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  pixelDelta = 64;

  @ViewChild(KeyboardPanInteractionComponent)
  interaction!: KeyboardPanInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('KeyboardPanInteractionComponent', () => {
  let fixture: ComponentFixture<KeyboardPanInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardPanInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyboardPanInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a keyboard-pan interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
