import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { ViewComponent } from '../view.component';
import { ControlZoomComponent } from './zoom.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-control-zoom [duration]="duration" [delta]="delta"></aol-control-zoom>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ControlZoomHostComponent {
  center = [0, 0];
  zoom = 2;
  duration = 0;
  delta = 2;

  readonly control = viewChild.required<ControlZoomComponent>(ControlZoomComponent);

  readonly view = viewChild.required<ViewComponent>(ViewComponent);
}

describe('ControlZoomComponent', () => {
  let fixture: ComponentFixture<ControlZoomHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlZoomHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlZoomHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('wires the zoom buttons to the map view using bound Angular inputs', () => {
    const zoomInButton = fixture.nativeElement.querySelector('.ol-zoom-in') as HTMLButtonElement;
    const zoomOutButton = fixture.nativeElement.querySelector('.ol-zoom-out') as HTMLButtonElement;

    expect(fixture.componentInstance.view().instance.getZoom()).toBe(2);

    zoomInButton.click();
    expect(fixture.componentInstance.view().instance.getZoom()).toBe(4);

    zoomOutButton.click();
    expect(fixture.componentInstance.view().instance.getZoom()).toBe(2);
  });
});
