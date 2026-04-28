import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualImports } from './individual-imports';

describe('IndividualImports', () => {
  let component: IndividualImports;
  let fixture: ComponentFixture<IndividualImports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualImports],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualImports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
