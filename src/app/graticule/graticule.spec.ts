import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graticule } from './graticule';

describe('Graticule', () => {
  let component: Graticule;
  let fixture: ComponentFixture<Graticule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graticule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Graticule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
