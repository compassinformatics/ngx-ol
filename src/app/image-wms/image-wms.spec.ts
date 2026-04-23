import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWms } from './image-wms';

describe('ImageWms', () => {
  let component: ImageWms;
  let fixture: ComponentFixture<ImageWms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWms],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageWms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
