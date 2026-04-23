import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayGeojsonSource } from './display-geojson-source';

describe('DisplayGeojsonSource', () => {
  let component: DisplayGeojsonSource;
  let fixture: ComponentFixture<DisplayGeojsonSource>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayGeojsonSource],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayGeojsonSource);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
