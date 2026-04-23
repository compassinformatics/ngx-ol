import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgcMapTile } from './ogc-map-tile';

describe('OgcMapTile', () => {
  let component: OgcMapTile;
  let fixture: ComponentFixture<OgcMapTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OgcMapTile],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(OgcMapTile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
