import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStatic } from './image-static';

describe('ImageStatic', () => {
  let component: ImageStatic;
  let fixture: ComponentFixture<ImageStatic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageStatic],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageStatic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
