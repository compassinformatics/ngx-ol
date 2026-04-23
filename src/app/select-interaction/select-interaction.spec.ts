import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInteraction } from './select-interaction';

describe('SelectInteraction', () => {
  let component: SelectInteraction;
  let fixture: ComponentFixture<SelectInteraction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInteraction],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectInteraction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
