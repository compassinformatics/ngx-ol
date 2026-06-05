import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveViewLayers } from './reactive-view-layers';

describe('ReactiveViewLayers', () => {
  let component: ReactiveViewLayers;
  let fixture: ComponentFixture<ReactiveViewLayers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveViewLayers],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveViewLayers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
