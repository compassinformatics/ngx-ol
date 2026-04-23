import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryComponents } from './geometry-components';

describe('GeometryComponents', () => {
  let component: GeometryComponents;
  let fixture: ComponentFixture<GeometryComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeometryComponents],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(GeometryComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
