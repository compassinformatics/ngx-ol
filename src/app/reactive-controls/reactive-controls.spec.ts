import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveControls } from './reactive-controls';

describe('ReactiveControls', () => {
  let component: ReactiveControls;
  let fixture: ComponentFixture<ReactiveControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveControls],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
