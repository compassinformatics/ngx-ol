import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { MapComponent } from './map.component';
import { GraticuleComponent } from './graticule.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-graticule [showLabels]="showLabels"></aol-graticule>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class GraticuleHostComponent {
  center = [0, 0];
  zoom = 2;
  showLabels = true;

  @ViewChild(GraticuleComponent)
  graticule!: GraticuleComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('GraticuleComponent', () => {
  let fixture: ComponentFixture<GraticuleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraticuleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraticuleHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a graticule bound to the map from template inputs', () => {
    expect(fixture.componentInstance.graticule.instance).toBeDefined();
    expect(fixture.componentInstance.graticule.instance.getMeridians()).toBeDefined();
  });
});
