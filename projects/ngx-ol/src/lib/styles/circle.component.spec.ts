import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { StyleComponent } from './style.component';
import { StyleCircleComponent } from './circle.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style>
              <aol-style-circle [radius]="radius()"></aol-style-circle>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleCircleHostComponent {
  center = [0, 0];
  zoom = 2;
  radius = signal(8);

  readonly circle = viewChild.required<StyleCircleComponent>(StyleCircleComponent);

  readonly style = viewChild.required<StyleComponent>(StyleComponent);
}

describe('StyleCircleComponent', () => {
  let fixture: ComponentFixture<StyleCircleHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleCircleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleCircleHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a circle image style and applies it to the style host', () => {
    expect(fixture.componentInstance.circle().instance.getRadius()).toBe(8);
    expect(fixture.componentInstance.style().instance.getImage()).toBe(
      fixture.componentInstance.circle().instance,
    );
  });

  it('updates the OpenLayers circle style when the radius binding changes', () => {
    fixture.componentInstance.radius.set(12);

    fixture.detectChanges(false);

    expect(fixture.componentInstance.circle().instance.getRadius()).toBe(12);
    expect(fixture.componentInstance.style().instance.getImage()).toBe(
      fixture.componentInstance.circle().instance,
    );
  });
});
