import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import WMTS from 'ol/tilegrid/WMTS';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { TileGridWMTSComponent } from './tilegridwmts.component';

@Component({
  template: `
    <aol-tilegrid-wmts
      [resolutions]="resolutions"
      [matrixIds]="matrixIds"
      [origin]="origin"
    ></aol-tilegrid-wmts>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class TileGridWmtsHostComponent {
  resolutions = [2, 1];
  matrixIds = ['0', '1'];
  origin: [number, number] = [0, 0];

  readonly tileGrid = viewChild.required<TileGridWMTSComponent>(TileGridWMTSComponent);
}

describe('TileGridWMTSComponent', () => {
  let fixture: ComponentFixture<TileGridWmtsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileGridWmtsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileGridWmtsHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a WMTS tile grid from template bindings', () => {
    expect(fixture.componentInstance.tileGrid().instance).toBeInstanceOf(WMTS);
  });
});
