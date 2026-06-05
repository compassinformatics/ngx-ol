import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { ViewComponent } from './view.component';
import { OverlayComponent } from './overlay.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom">
        <aol-coordinate [x]="viewX" [y]="viewY" [srid]="viewSrid"></aol-coordinate>
      </aol-view>
      <aol-overlay [position]="overlayPosition">
        <aol-coordinate [x]="overlayX" [y]="overlayY" [srid]="overlaySrid"></aol-coordinate>
        <aol-content><div>Popup</div></aol-content>
      </aol-overlay>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class CoordinateHostComponent {
  center = [0, 0];
  zoom = 2;
  viewX = 7;
  viewY = 9;
  viewSrid = 'EPSG:3857';
  overlayPosition: [number, number] = [0, 0];
  overlayX = 1;
  overlayY = 2;
  overlaySrid = 'EPSG:3857';

  readonly view = viewChild.required<ViewComponent>(ViewComponent);

  readonly overlay = viewChild.required<OverlayComponent>(OverlayComponent);
}

describe('CoordinateComponent', () => {
  let fixture: ComponentFixture<CoordinateHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinateHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('projects bound coordinates into its host view and overlay', () => {
    expect(fixture.componentInstance.view().instance.getCenter()).toEqual([7, 9]);
    expect(fixture.componentInstance.overlay().instance.getPosition()).toEqual([1, 2]);
  });
});
