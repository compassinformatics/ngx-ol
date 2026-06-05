import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DefaultInteractionComponent } from './default.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-default [dragPan]="dragPan"></aol-interaction-default>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DefaultInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  dragPan = true;

  readonly interaction = viewChild.required<DefaultInteractionComponent>(
    DefaultInteractionComponent,
  );

  readonly map = viewChild.required<MapComponent>(MapComponent);
}

describe('DefaultInteractionComponent', () => {
  let fixture: ComponentFixture<DefaultInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes the default interaction collection with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map().instance;
    const interactions = host.interaction().instance.getArray();

    expect(interactions.length).toBeGreaterThan(0);
    interactions.forEach((interaction) => {
      expect(map.getInteractions().getArray()).toContain(interaction);
    });

    fixture!.destroy();
    fixture = undefined;

    interactions.forEach((interaction) => {
      expect(map.getInteractions().getArray()).not.toContain(interaction);
    });
  });
});
