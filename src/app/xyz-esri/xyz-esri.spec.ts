import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XyzEsri } from './xyz-esri';

describe('XyzEsri', () => {
  let component: XyzEsri;
  let fixture: ComponentFixture<XyzEsri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XyzEsri],
    }).compileComponents();

    fixture = TestBed.createComponent(XyzEsri);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
