import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Utfgrid } from './utfgrid';

describe('Utfgrid', () => {
  let component: Utfgrid;
  let fixture: ComponentFixture<Utfgrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Utfgrid],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Utfgrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
