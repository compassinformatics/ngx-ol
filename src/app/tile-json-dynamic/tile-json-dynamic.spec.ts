import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileJsonDynamic } from './tile-json-dynamic';

describe('TileJsonDynamic', () => {
  let component: TileJsonDynamic;
  let fixture: ComponentFixture<TileJsonDynamic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileJsonDynamic],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TileJsonDynamic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
