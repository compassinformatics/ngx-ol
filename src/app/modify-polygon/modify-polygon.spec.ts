import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPolygon } from './modify-polygon';

describe('ModifyPolygon', () => {
  let component: ModifyPolygon;
  let fixture: ComponentFixture<ModifyPolygon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyPolygon],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyPolygon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
