import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { FeatureComponent } from '../feature.component';
import { StyleComponent } from './style.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style [zIndex]="zIndex"></aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleHostComponent {
  center = [0, 0];
  zoom = 2;
  zIndex = 3;

  @ViewChild(StyleComponent)
  style!: StyleComponent;

  @ViewChild(FeatureComponent)
  feature!: FeatureComponent;
}

@Component({
  template: `<aol-style></aol-style>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class InvalidStyleHostComponent {}

describe('StyleComponent', () => {
  let fixture: ComponentFixture<StyleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleHostComponent, InvalidStyleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a style and attaches it to the host feature', () => {
    expect(fixture.componentInstance.feature.instance.getStyle()).toBe(
      fixture.componentInstance.style.instance,
    );
    expect(fixture.componentInstance.style.instance.getZIndex()).toBe(3);
  });

  it('throws when rendered without a feature or layer host', () => {
    expect(() => TestBed.createComponent(InvalidStyleHostComponent)).toThrow(
      'aol-style must be applied to a feature or a layer',
    );
  });
});
