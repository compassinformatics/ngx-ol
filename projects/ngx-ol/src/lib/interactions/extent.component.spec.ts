import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { ExtentInteractionComponent } from './extent.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-extent
        [extent]="extent"
        (extentChanged)="extentChanged($event)"
      ></aol-interaction-extent>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ExtentInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  extent: [number, number, number, number] = [-5, -5, 5, 5];
  extentChanged = vi.fn();

  @ViewChild(ExtentInteractionComponent)
  interaction!: ExtentInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('ExtentInteractionComponent', () => {
  let fixture: ComponentFixture<ExtentInteractionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtentInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtentInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds an extent interaction to the map and forwards extent change events', () => {
    const host = fixture.componentInstance;

    expect(host.map.instance.getInteractions().getArray()).toContain(host.interaction.instance);

    host.interaction.instance.dispatchEvent('extentchanged');

    expect(host.extentChanged).toHaveBeenCalledOnce();
  });
});
