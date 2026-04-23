import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcgisTiled } from './arcgis-tiled';

describe('ArcgisTiled', () => {
  let component: ArcgisTiled;
  let fixture: ComponentFixture<ArcgisTiled>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcgisTiled],
    }).compileComponents();

    fixture = TestBed.createComponent(ArcgisTiled);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
