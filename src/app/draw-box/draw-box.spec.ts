import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawBox } from './draw-box';

describe('DrawBox', () => {
  let component: DrawBox;
  let fixture: ComponentFixture<DrawBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawBox],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
