import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import MVT from 'ol/format/MVT.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FormatMVTComponent } from './mvt.component';

@Component({
  template: `<aol-format-mvt [featureClass]="featureClass"></aol-format-mvt>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class FormatMVTHostComponent {
  featureClass = undefined;

  readonly format = viewChild.required<FormatMVTComponent>(FormatMVTComponent);
}

describe('FormatMVTComponent', () => {
  let fixture: ComponentFixture<FormatMVTHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatMVTHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormatMVTHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates an MVT format from template bindings', () => {
    expect(fixture.componentInstance.format().instance).toBeInstanceOf(MVT);
  });
});
