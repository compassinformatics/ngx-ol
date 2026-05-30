import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveStyles } from './reactive-styles';

describe('ReactiveStyles', () => {
  let component: ReactiveStyles;
  let fixture: ComponentFixture<ReactiveStyles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveStyles],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveStyles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
