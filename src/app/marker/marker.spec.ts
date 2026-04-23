import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marker } from './marker';

describe('Marker', () => {
  let component: Marker;
  let fixture: ComponentFixture<Marker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marker],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Marker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
