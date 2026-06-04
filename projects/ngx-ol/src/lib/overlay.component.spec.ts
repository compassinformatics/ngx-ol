import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { OverlayComponent } from './overlay.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-overlay [position]="position">
        <aol-content><div>Popup</div></aol-content>
      </aol-overlay>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class OverlayHostComponent {
  center = [0, 0];
  zoom = 2;
  position: [number, number] = [1, 2];

  readonly overlay = viewChild.required<OverlayComponent>(OverlayComponent);
}

describe('OverlayComponent', () => {
  let fixture: ComponentFixture<OverlayHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates an overlay and binds its position from the template', () => {
    expect(fixture.componentInstance.overlay().instance.getPosition()).toEqual([1, 2]);
  });
});
