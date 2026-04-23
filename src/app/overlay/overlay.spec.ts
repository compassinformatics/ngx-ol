import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Overlay } from './overlay';

describe('Overlay', () => {
  let component: Overlay;
  let fixture: ComponentFixture<Overlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overlay],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Overlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
