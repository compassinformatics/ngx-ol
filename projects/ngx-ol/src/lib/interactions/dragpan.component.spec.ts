import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DragPanInteractionComponent } from './dragpan.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-dragpan></aol-interaction-dragpan>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DragPanInteractionHostComponent {
  center = [0, 0];
  zoom = 2;

  @ViewChild(DragPanInteractionComponent)
  interaction!: DragPanInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('DragPanInteractionComponent', () => {
  let fixture: ComponentFixture<DragPanInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragPanInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DragPanInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a drag-pan interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
