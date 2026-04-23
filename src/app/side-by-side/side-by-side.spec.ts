import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBySide } from './side-by-side';

describe('SideBySide', () => {
  let component: SideBySide;
  let fixture: ComponentFixture<SideBySide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBySide],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBySide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
