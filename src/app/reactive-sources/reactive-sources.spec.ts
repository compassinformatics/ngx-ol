import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveSources } from './reactive-sources';

describe('ReactiveSources', () => {
  let component: ReactiveSources;
  let fixture: ComponentFixture<ReactiveSources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveSources],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveSources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
