import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { StyleComponent } from './style.component';
import { StyleIconComponent } from './icon.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style>
              <aol-style-icon
                [src]="src()"
                [opacity]="opacity()"
                [rotation]="rotation()"
                [scale]="scale()"
              ></aol-style-icon>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleIconHostComponent {
  center = [0, 0];
  zoom = 2;
  src = signal('marker.svg');
  opacity = signal(0.5);
  rotation = signal(0);
  scale = signal(1);

  @ViewChild(StyleIconComponent)
  icon!: StyleIconComponent;

  @ViewChild(StyleComponent)
  style!: StyleComponent;
}

describe('StyleIconComponent', () => {
  let fixture: ComponentFixture<StyleIconHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleIconHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleIconHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates an icon style and applies it to the style host', () => {
    expect(fixture.componentInstance.icon.instance.getOpacity()).toBe(0.5);
    expect(fixture.componentInstance.style.instance.getImage()).toBe(
      fixture.componentInstance.icon.instance,
    );
  });

  it('updates the OpenLayers icon style when template bindings change', () => {
    const previousIcon = fixture.componentInstance.icon.instance;

    fixture.componentInstance.opacity.set(0.75);
    fixture.componentInstance.rotation.set(1);
    fixture.componentInstance.scale.set(2);
    fixture.componentInstance.src.set('marker-updated.svg');

    fixture.detectChanges(false);

    expect(fixture.componentInstance.icon.instance).not.toBe(previousIcon);
    expect(fixture.componentInstance.icon.instance.getOpacity()).toBe(0.75);
    expect(fixture.componentInstance.icon.instance.getRotation()).toBe(1);
    expect(fixture.componentInstance.icon.instance.getScale()).toBe(2);
    expect(fixture.componentInstance.style.instance.getImage()).toBe(
      fixture.componentInstance.icon.instance,
    );
  });
});
