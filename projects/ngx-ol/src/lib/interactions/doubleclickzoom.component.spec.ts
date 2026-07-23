import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import MapBrowserEvent from 'ol/MapBrowserEvent.js';
import MapBrowserEventType from 'ol/MapBrowserEventType.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ViewComponent } from '../view.component';
import { DoubleClickZoomInteractionComponent } from './doubleclickzoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-doubleclickzoom
        [duration]="duration"
        [delta]="delta"
      ></aol-interaction-doubleclickzoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class DoubleClickZoomHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 0;
  delta = 2;

  readonly interaction = viewChild.required<DoubleClickZoomInteractionComponent>(
    DoubleClickZoomInteractionComponent,
  );

  readonly map = viewChild.required<MapComponent>(MapComponent);

  readonly view = viewChild.required<ViewComponent>(ViewComponent);
}

describe('DoubleClickZoomInteractionComponent', () => {
  let fixture: ComponentFixture<DoubleClickZoomHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleClickZoomHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoubleClickZoomHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('uses bound Angular inputs to zoom the view on double click events', () => {
    const preventDefault = vi.fn();
    const originalEvent = {
      shiftKey: false,
      preventDefault,
    } as unknown as MouseEvent;
    const event = new MapBrowserEvent(
      MapBrowserEventType.DBLCLICK,
      fixture.componentInstance.map().instance,
      originalEvent,
      false,
      undefined,
      [],
    );
    event.coordinate = [0, 0];

    expect(fixture.componentInstance.view().instance.getZoom()).toBe(2);

    const handled = fixture.componentInstance.interaction().instance.handleEvent(event);

    expect(handled).toBe(false);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(fixture.componentInstance.view().instance.getZoom()).toBe(4);
  });
});
