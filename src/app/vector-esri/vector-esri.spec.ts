import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorEsri } from './vector-esri';

describe('VectorEsri', () => {
  let component: VectorEsri;
  let fixture: ComponentFixture<VectorEsri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VectorEsri],
    }).compileComponents();

    fixture = TestBed.createComponent(VectorEsri);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
