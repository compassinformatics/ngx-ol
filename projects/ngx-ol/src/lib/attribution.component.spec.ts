import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { AttributionComponent } from './attribution.component';

@Component({
  template: `<aol-attribution>Data Provider</aol-attribution>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class AttributionHostComponent {
  readonly attribution = viewChild.required<AttributionComponent>(AttributionComponent);
}

describe('AttributionComponent', () => {
  let fixture: ComponentFixture<AttributionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('captures its projected markup as the attribution label', () => {
    expect(fixture.componentInstance.attribution().label).toBe('Data Provider');
  });
});
