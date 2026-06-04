import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import VectorSource from 'ol/source/Vector';
import type { Type } from 'ol/geom/Geometry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { DrawInteractionComponent } from './draw.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-draw
        [type]="type()"
        [trace]="trace()"
        [source]="source"
        (drawStart)="drawStart($event)"
        (drawEnd)="drawEnd($event)"
        (drawAbort)="drawAbort($event)"
        (olChange)="change($event)"
        (changeActive)="changeActive($event)"
        (olError)="error($event)"
        (propertyChange)="propertyChange($event)"
      ></aol-interaction-draw>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DrawInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  type = signal<Type>('Point');
  trace = signal(false);
  source = new VectorSource();
  drawStart = vi.fn();
  drawEnd = vi.fn();
  drawAbort = vi.fn();
  change = vi.fn();
  changeActive = vi.fn();
  error = vi.fn();
  propertyChange = vi.fn();

  @ViewChild(DrawInteractionComponent)
  interaction!: DrawInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('DrawInteractionComponent', () => {
  let fixture: ComponentFixture<DrawInteractionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds a draw interaction to the map and forwards OpenLayers events', () => {
    const host = fixture.componentInstance;

    expect(host.map.instance.getInteractions().getArray()).toContain(host.interaction.instance);

    host.interaction.instance.dispatchEvent('drawstart');
    host.interaction.instance.dispatchEvent('drawend');
    host.interaction.instance.dispatchEvent('drawabort');
    host.interaction.instance.dispatchEvent('change');
    host.interaction.instance.dispatchEvent('change:active');
    host.interaction.instance.dispatchEvent('error');
    host.interaction.instance.dispatchEvent('propertychange');

    expect(host.drawStart).toHaveBeenCalledOnce();
    expect(host.drawEnd).toHaveBeenCalledOnce();
    expect(host.drawAbort).toHaveBeenCalledOnce();
    expect(host.change).toHaveBeenCalledOnce();
    expect(host.changeActive).toHaveBeenCalledOnce();
    expect(host.error).toHaveBeenCalledOnce();
    expect(host.propertyChange).toHaveBeenCalledOnce();
  });

  it('replaces the registered draw interaction when the draw type changes', () => {
    const host = fixture.componentInstance;
    const oldInteraction = host.interaction.instance;

    host.type.set('Polygon');
    fixture.detectChanges(false);

    expect(host.interaction.instance).not.toBe(oldInteraction);
    expect(host.map.instance.getInteractions().getArray()).toContain(host.interaction.instance);
    expect(host.map.instance.getInteractions().getArray()).not.toContain(oldInteraction);
  });

  it('updates trace without replacing the draw interaction', () => {
    const host = fixture.componentInstance;
    const interaction = host.interaction.instance;

    host.trace.set(true);
    fixture.detectChanges(false);

    expect(host.interaction.instance).toBe(interaction);
  });
});
