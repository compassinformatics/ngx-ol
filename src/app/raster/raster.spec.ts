import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Raster } from './raster';

describe('Raster', () => {
  let component: Raster;
  let fixture: ComponentFixture<Raster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Raster],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Raster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
