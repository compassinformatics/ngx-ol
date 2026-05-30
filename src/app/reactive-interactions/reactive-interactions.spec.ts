import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveInteractions } from './reactive-interactions';

describe('ReactiveInteractions', () => {
  let component: ReactiveInteractions;
  let fixture: ComponentFixture<ReactiveInteractions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveInteractions],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveInteractions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
