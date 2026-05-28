import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { OverlayComponent } from './overlay.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-overlay [position]="position()" [offset]="offset()" [positioning]="positioning()">
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
  position = signal<[number, number]>([1, 2]);
  offset = signal<[number, number]>([0, 0]);
  positioning = signal<'top-left' | 'bottom-right'>('top-left');

  @ViewChild(OverlayComponent)
  overlay!: OverlayComponent;
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
    expect(fixture.componentInstance.overlay.instance.getPosition()).toEqual([1, 2]);
  });

  it('updates live overlay bindings without recreating the overlay', () => {
    const host = fixture.componentInstance;
    const previousOverlay = host.overlay.instance;

    host.position.set([3, 4]);
    host.offset.set([5, 6]);
    host.positioning.set('bottom-right');
    fixture.detectChanges();

    expect(host.overlay.instance).toBe(previousOverlay);
    expect(host.overlay.instance.getPosition()).toEqual([3, 4]);
    expect(host.overlay.instance.getOffset()).toEqual([5, 6]);
    expect(host.overlay.instance.getPositioning()).toBe('bottom-right');
  });
});
