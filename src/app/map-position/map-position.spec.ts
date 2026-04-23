import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPosition } from './map-position';

describe('MapPosition', () => {
  let component: MapPosition;
  let fixture: ComponentFixture<MapPosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPosition],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPosition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
