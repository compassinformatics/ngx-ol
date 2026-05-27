import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { TileGridComponent } from './tilegrid.component';

@Component({
  template: `<aol-tilegrid [resolutions]="resolutions" [origin]="origin"></aol-tilegrid>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class TileGridHostComponent {
  resolutions = [2, 1];
  origin: [number, number] = [0, 0];

  @ViewChild(TileGridComponent)
  tileGrid!: TileGridComponent;
}

describe('TileGridComponent', () => {
  let fixture: ComponentFixture<TileGridHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileGridHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileGridHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a tile grid from template bindings', () => {
    expect(fixture.componentInstance.tileGrid.instance.getResolutions()).toEqual([2, 1]);
  });
});
