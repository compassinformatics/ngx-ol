import { Component, signal, viewChild, viewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { StyleCircleComponent } from './circle.component';
import { StyleStrokeComponent } from './stroke.component';
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
              <aol-style-stroke
                [color]="color()"
                [lineDash]="lineDash()"
                [lineDashOffset]="lineDashOffset()"
                [lineCap]="lineCap()"
                [lineJoin]="lineJoin()"
                [miterLimit]="miterLimit()"
                [width]="width()"
              ></aol-style-stroke>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleStrokeHostComponent {
  center = [0, 0];
  zoom = 2;
  color = signal('#ff0000');
  lineDash = signal([1, 2]);
  lineDashOffset = signal(0);
  lineCap = signal<CanvasLineCap>('round');
  lineJoin = signal<CanvasLineJoin>('round');
  miterLimit = signal(4);
  width = signal(2);

  readonly stroke = viewChild.required<StyleStrokeComponent>(StyleStrokeComponent);

  readonly style = viewChild.required<StyleComponent>(StyleComponent);
}

@Component({
  template: `<aol-style-stroke [color]="'#ff0000'" [width]="2"></aol-style-stroke>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class InvalidStyleStrokeHostComponent {}

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style>
              <aol-style-circle [radius]="radius">
                <aol-style-stroke [color]="circleColor" [width]="circleWidth"></aol-style-stroke>
              </aol-style-circle>
              <aol-style-text [text]="text">
                <aol-style-stroke [color]="textColor" [width]="textWidth"></aol-style-stroke>
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
class NestedStyleStrokeHostComponent {
  center = [0, 0];
  zoom = 2;
  radius = 8;
  circleColor = '#ff0000';
  circleWidth = 2;
  text = 'Label';
  textColor = '#0000ff';
  textWidth = 4;

  readonly circle = viewChild.required<StyleCircleComponent>(StyleCircleComponent);

  readonly textStyle = viewChild.required<StyleTextComponent>(StyleTextComponent);

  readonly strokes = viewChildren<StyleStrokeComponent>(StyleStrokeComponent);
}

describe('StyleStrokeComponent', () => {
  let fixture: ComponentFixture<StyleStrokeHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StyleStrokeHostComponent,
        InvalidStyleStrokeHostComponent,
        NestedStyleStrokeHostComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleStrokeHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a stroke and applies it to the style host', () => {
    expect(fixture.componentInstance.stroke().instance.getColor()).toBe('#ff0000');
    expect(fixture.componentInstance.stroke().instance.getLineDash()).toEqual([1, 2]);
    expect(fixture.componentInstance.stroke().instance.getLineDashOffset()).toBe(0);
    expect(fixture.componentInstance.stroke().instance.getLineCap()).toBe('round');
    expect(fixture.componentInstance.stroke().instance.getLineJoin()).toBe('round');
    expect(fixture.componentInstance.stroke().instance.getMiterLimit()).toBe(4);
    expect(fixture.componentInstance.stroke().instance.getWidth()).toBe(2);
    expect(fixture.componentInstance.style().instance.getStroke()).toBe(
      fixture.componentInstance.stroke().instance,
    );
  });

  it('updates the OpenLayers stroke when template bindings change', () => {
    fixture.componentInstance.color.set('#0000ff');
    fixture.componentInstance.lineDash.set([4, 8]);
    fixture.componentInstance.lineDashOffset.set(2);
    fixture.componentInstance.lineCap.set('square');
    fixture.componentInstance.lineJoin.set('bevel');
    fixture.componentInstance.miterLimit.set(8);
    fixture.componentInstance.width.set(6);

    fixture.detectChanges(false);

    expect(fixture.componentInstance.stroke().instance.getColor()).toBe('#0000ff');
    expect(fixture.componentInstance.stroke().instance.getLineDash()).toEqual([4, 8]);
    expect(fixture.componentInstance.stroke().instance.getLineDashOffset()).toBe(2);
    expect(fixture.componentInstance.stroke().instance.getLineCap()).toBe('square');
    expect(fixture.componentInstance.stroke().instance.getLineJoin()).toBe('bevel');
    expect(fixture.componentInstance.stroke().instance.getMiterLimit()).toBe(8);
    expect(fixture.componentInstance.stroke().instance.getWidth()).toBe(6);
    expect(fixture.componentInstance.style().instance.getStroke()).toBe(
      fixture.componentInstance.stroke().instance,
    );
  });

  it('throws when rendered without a style host', () => {
    expect(() => TestBed.createComponent(InvalidStyleStrokeHostComponent)).toThrow(
      'aol-style-stroke must be a descendant of aol-style',
    );
  });

  it('applies stroke children to circle and text style hosts', () => {
    const nestedFixture = TestBed.createComponent(NestedStyleStrokeHostComponent);
    nestedFixture.detectChanges();
    const strokes = nestedFixture.componentInstance.strokes();

    expect(nestedFixture.componentInstance.circle().instance.getStroke()).toBe(strokes[0].instance);
    expect(nestedFixture.componentInstance.textStyle().instance.getStroke()).toBe(
      strokes[1].instance,
    );

    nestedFixture.destroy();
  });
});
