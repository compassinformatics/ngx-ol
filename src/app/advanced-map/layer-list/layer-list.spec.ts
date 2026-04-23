import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerList } from './layer-list';
import { layers } from '../layers';

describe('LayerList', () => {
  let component: LayerList;
  let fixture: ComponentFixture<LayerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerList],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('layers', [...layers]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
