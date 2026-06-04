import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveOverlays } from './reactive-overlays';

describe('ReactiveOverlays', () => {
  let component: ReactiveOverlays;
  let fixture: ComponentFixture<ReactiveOverlays>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveOverlays],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveOverlays);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
