import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInteractions } from './map-interactions';

describe('MapInteractions', () => {
  let component: MapInteractions;
  let fixture: ComponentFixture<MapInteractions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapInteractions],
    }).compileComponents();

    fixture = TestBed.createComponent(MapInteractions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
