import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcgisImage } from './arcgis-image';

describe('ArcgisImage', () => {
  let component: ArcgisImage;
  let fixture: ComponentFixture<ArcgisImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcgisImage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArcgisImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
