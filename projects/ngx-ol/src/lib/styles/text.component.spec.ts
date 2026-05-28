import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
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
              <aol-style-text
                [text]="text()"
                [font]="font()"
                [offsetX]="offsetX()"
                [offsetY]="offsetY()"
                [scale]="scale()"
                [rotation]="rotation()"
                [rotateWithView]="rotateWithView()"
                [textAlign]="textAlign()"
                [textBaseline]="textBaseline()"
              ></aol-style-text>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleTextHostComponent {
  center = [0, 0];
  zoom = 2;
  text = signal('Label');
  font = signal('12px sans-serif');
  offsetX = signal(0);
  offsetY = signal(0);
  scale = signal(1);
  rotation = signal(0);
  rotateWithView = signal(false);
  textAlign = signal<CanvasTextAlign>('center');
  textBaseline = signal<CanvasTextBaseline>('middle');

  @ViewChild(StyleTextComponent)
  textStyle!: StyleTextComponent;

  @ViewChild(StyleComponent)
  style!: StyleComponent;
}

@Component({
  template: `<aol-style-text [text]="'Label'"></aol-style-text>`,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class InvalidStyleTextHostComponent {}

describe('StyleTextComponent', () => {
  let fixture: ComponentFixture<StyleTextHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleTextHostComponent, InvalidStyleTextHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleTextHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a text style and applies it to the style host', () => {
    expect(fixture.componentInstance.textStyle.instance.getText()).toBe('Label');
    expect(fixture.componentInstance.textStyle.instance.getFont()).toBe('12px sans-serif');
    expect(fixture.componentInstance.textStyle.instance.getTextAlign()).toBe('center');
    expect(fixture.componentInstance.textStyle.instance.getTextBaseline()).toBe('middle');
    expect(fixture.componentInstance.style.instance.getText()).toBe(
      fixture.componentInstance.textStyle.instance,
    );
  });

  it('updates the OpenLayers text style when template bindings change', () => {
    const previousText = fixture.componentInstance.textStyle.instance;

    fixture.componentInstance.text.set('Updated label');
    fixture.componentInstance.font.set('14px serif');
    fixture.componentInstance.offsetX.set(10);
    fixture.componentInstance.offsetY.set(20);
    fixture.componentInstance.scale.set(2);
    fixture.componentInstance.rotation.set(1);
    fixture.componentInstance.rotateWithView.set(true);
    fixture.componentInstance.textAlign.set('left');
    fixture.componentInstance.textBaseline.set('top');

    fixture.detectChanges(false);

    expect(fixture.componentInstance.textStyle.instance).toBe(previousText);
    expect(fixture.componentInstance.textStyle.instance.getText()).toBe('Updated label');
    expect(fixture.componentInstance.textStyle.instance.getFont()).toBe('14px serif');
    expect(fixture.componentInstance.textStyle.instance.getOffsetX()).toBe(10);
    expect(fixture.componentInstance.textStyle.instance.getOffsetY()).toBe(20);
    expect(fixture.componentInstance.textStyle.instance.getScale()).toBe(2);
    expect(fixture.componentInstance.textStyle.instance.getRotation()).toBe(1);
    expect(fixture.componentInstance.textStyle.instance.getRotateWithView()).toBe(true);
    expect(fixture.componentInstance.textStyle.instance.getTextAlign()).toBe('left');
    expect(fixture.componentInstance.textStyle.instance.getTextBaseline()).toBe('top');
    expect(fixture.componentInstance.style.instance.getText()).toBe(
      fixture.componentInstance.textStyle.instance,
    );
  });

  it('updates only changed text style bindings without disturbing the style host', () => {
    fixture.componentInstance.font.set('16px serif');

    fixture.detectChanges(false);

    expect(fixture.componentInstance.textStyle.instance.getFont()).toBe('16px serif');
    expect(fixture.componentInstance.textStyle.instance.getTextBaseline()).toBe('middle');

    fixture.componentInstance.textBaseline.set('bottom');

    fixture.detectChanges(false);

    expect(fixture.componentInstance.textStyle.instance.getFont()).toBe('16px serif');
    expect(fixture.componentInstance.textStyle.instance.getTextBaseline()).toBe('bottom');
    expect(fixture.componentInstance.style.instance.getText()).toBe(
      fixture.componentInstance.textStyle.instance,
    );
  });

  it('throws when rendered without a style host', () => {
    expect(() => TestBed.createComponent(InvalidStyleTextHostComponent)).toThrow(
      'aol-style-text must be a descendant of aol-style',
    );
  });
});
