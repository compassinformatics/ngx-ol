import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectionUpdate } from './view-projection-update';

describe('ViewProjectionUpdate', () => {
  let component: ViewProjectionUpdate;
  let fixture: ComponentFixture<ViewProjectionUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProjectionUpdate],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProjectionUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
