import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectHover } from './color-select-hover';

describe('ColorSelectHover', () => {
  let component: ColorSelectHover;
  let fixture: ComponentFixture<ColorSelectHover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSelectHover],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSelectHover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
