import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgcVectorTile } from './ogc-vector-tile';

describe('OgcVectorTile', () => {
  let component: OgcVectorTile;
  let fixture: ComponentFixture<OgcVectorTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OgcVectorTile],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OgcVectorTile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
