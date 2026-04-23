import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileJson } from './tile-json';

describe('TileJson', () => {
  let component: TileJson;
  let fixture: ComponentFixture<TileJson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileJson],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TileJson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
