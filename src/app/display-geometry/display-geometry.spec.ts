import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayGeometry } from './display-geometry';

describe('DisplayGeometry', () => {
  let component: DisplayGeometry;
  let fixture: ComponentFixture<DisplayGeometry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayGeometry],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayGeometry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
