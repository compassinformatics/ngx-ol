import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorPosition } from './cursor-position';

describe('CursorPosition', () => {
  let component: CursorPosition;
  let fixture: ComponentFixture<CursorPosition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursorPosition],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(CursorPosition);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
