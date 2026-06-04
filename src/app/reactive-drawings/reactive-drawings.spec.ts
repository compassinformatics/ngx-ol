import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveDrawings } from './reactive-drawings';

describe('ReactiveDrawings', () => {
  let component: ReactiveDrawings;
  let fixture: ComponentFixture<ReactiveDrawings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveDrawings],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveDrawings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
