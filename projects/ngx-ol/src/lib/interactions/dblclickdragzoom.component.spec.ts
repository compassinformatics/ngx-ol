import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DblClickDragZoomInteractionComponent } from './dblclickdragzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-dblclickdragzoom
        [duration]="duration"
      ></aol-interaction-dblclickdragzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DblClickDragZoomInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 100;

  @ViewChild(DblClickDragZoomInteractionComponent)
  interaction!: DblClickDragZoomInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('DblClickDragZoomInteractionComponent', () => {
  let fixture: ComponentFixture<DblClickDragZoomInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DblClickDragZoomInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DblClickDragZoomInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a double-click drag zoom interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
