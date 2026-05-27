import { Component, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { StyleCircleComponent } from './circle.component';
import { StyleFillComponent } from './fill.component';
import { StyleComponent } from './style.component';
import { StyleTextComponent } from './text.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style>
              <aol-style-fill [color]="color()"></aol-style-fill>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleFillHostComponent {
  center = [0, 0];
  zoom = 2;
  color = signal('#00ff00');

  @ViewChild(StyleFillComponent)
  fill!: StyleFillComponent;

  @ViewChild(StyleComponent)
  style!: StyleComponent;
}

@Component({
  template: `<aol-style-fill [color]="'#00ff00'"></aol-style-fill>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class InvalidStyleFillHostComponent {}

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style>
              <aol-style-circle [radius]="radius">
                <aol-style-fill [color]="circleColor"></aol-style-fill>
              </aol-style-circle>
              <aol-style-text [text]="text">
                <aol-style-fill [color]="textColor"></aol-style-fill>
              </aol-style-text>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class NestedStyleFillHostComponent {
  center = [0, 0];
  zoom = 2;
  radius = 8;
  circleColor = '#ff0000';
  text = 'Label';
  textColor = '#0000ff';

  @ViewChild(StyleCircleComponent)
  circle!: StyleCircleComponent;

  @ViewChild(StyleTextComponent)
  textStyle!: StyleTextComponent;

  @ViewChildren(StyleFillComponent)
  fills!: QueryList<StyleFillComponent>;
}

describe('StyleFillComponent', () => {
  let fixture: ComponentFixture<StyleFillHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StyleFillHostComponent,
        InvalidStyleFillHostComponent,
        NestedStyleFillHostComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleFillHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a fill and applies it to the style host', () => {
    expect(fixture.componentInstance.fill.instance.getColor()).toBe('#00ff00');
    expect(fixture.componentInstance.style.instance.getFill()).toBe(
      fixture.componentInstance.fill.instance,
    );
  });

  it('updates the OpenLayers fill when the color binding changes', () => {
    fixture.componentInstance.color.set('#0000ff');

    fixture.detectChanges(false);

    expect(fixture.componentInstance.fill.instance.getColor()).toBe('#0000ff');
    expect(fixture.componentInstance.style.instance.getFill()).toBe(
      fixture.componentInstance.fill.instance,
    );
  });

  it('throws when rendered without a style host', () => {
    expect(() => TestBed.createComponent(InvalidStyleFillHostComponent)).toThrow(
      'aol-style-fill must be a descendant of aol-style',
    );
  });

  it('applies fill children to circle and text style hosts', () => {
    const nestedFixture = TestBed.createComponent(NestedStyleFillHostComponent);
    nestedFixture.detectChanges();
    const fills = nestedFixture.componentInstance.fills.toArray();

    expect(nestedFixture.componentInstance.circle.instance.getFill()).toBe(fills[0].instance);
    expect(nestedFixture.componentInstance.textStyle.instance.getFill()).toBe(fills[1].instance);

    nestedFixture.destroy();
  });
});
