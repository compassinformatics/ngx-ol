import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedMap } from './advanced-map';

describe('AdvancedMap', () => {
  let component: AdvancedMap;
  let fixture: ComponentFixture<AdvancedMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedMap],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
