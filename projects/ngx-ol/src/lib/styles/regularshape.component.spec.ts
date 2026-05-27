import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { StyleComponent } from './style.component';
import { StyleRegularShapeComponent } from './regularshape.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vector>
        <aol-source-vector>
          <aol-feature>
            <aol-style>
              <aol-style-regularshape
                [angle]="angle()"
                [declutterMode]="declutterMode()"
                [displacement]="displacement()"
                [points]="points()"
                [radius]="radius()"
                [radius2]="radius2()"
                [rotateWithView]="rotateWithView()"
                [rotation]="rotation()"
                [scale]="scale()"
              ></aol-style-regularshape>
            </aol-style>
          </aol-feature>
        </aol-source-vector>
      </aol-layer-vector>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class StyleRegularShapeHostComponent {
  center = [0, 0];
  zoom = 2;
  angle = signal(0);
  declutterMode = signal<'declutter' | 'obstacle' | 'none'>('declutter');
  displacement = signal([0, 0]);
  points = signal(5);
  radius = signal(14);
  radius2 = signal(7);
  rotateWithView = signal(false);
  rotation = signal(0);
  scale = signal(1);

  @ViewChild(StyleRegularShapeComponent)
  regularShape!: StyleRegularShapeComponent;

  @ViewChild(StyleComponent)
  style!: StyleComponent;
}

describe('StyleRegularShapeComponent', () => {
  let fixture: ComponentFixture<StyleRegularShapeHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleRegularShapeHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleRegularShapeHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a regular shape image style and applies it to the style host', () => {
    expect(fixture.componentInstance.regularShape.instance.getRadius()).toBe(14);
    expect(fixture.componentInstance.regularShape.instance.getDisplacement()).toEqual([0, 0]);
    expect(fixture.componentInstance.regularShape.instance.getRotateWithView()).toBe(false);
    expect(fixture.componentInstance.regularShape.instance.getRotation()).toBe(0);
    expect(fixture.componentInstance.regularShape.instance.getScale()).toBe(1);
    expect(fixture.componentInstance.style.instance.getImage()).toBe(
      fixture.componentInstance.regularShape.instance,
    );
  });

  it('recreates and reapplies the OpenLayers regular shape when template bindings change', () => {
    const previousShape = fixture.componentInstance.regularShape.instance;

    fixture.componentInstance.angle.set(1);
    fixture.componentInstance.declutterMode.set('obstacle');
    fixture.componentInstance.displacement.set([4, 8]);
    fixture.componentInstance.points.set(6);
    fixture.componentInstance.radius.set(18);
    fixture.componentInstance.radius2.set(9);
    fixture.componentInstance.rotateWithView.set(true);
    fixture.componentInstance.rotation.set(2);
    fixture.componentInstance.scale.set(1.5);

    fixture.detectChanges(false);

    expect(fixture.componentInstance.regularShape.instance).not.toBe(previousShape);
    expect(fixture.componentInstance.regularShape.instance.getRadius()).toBe(18);
    expect(fixture.componentInstance.regularShape.instance.getDisplacement()).toEqual([4, 8]);
    expect(fixture.componentInstance.regularShape.instance.getRotateWithView()).toBe(true);
    expect(fixture.componentInstance.regularShape.instance.getRotation()).toBe(2);
    expect(fixture.componentInstance.regularShape.instance.getScale()).toBe(1.5);
    expect(fixture.componentInstance.style.instance.getImage()).toBe(
      fixture.componentInstance.regularShape.instance,
    );
  });

  it('recreates the regular shape when each optional shape binding changes independently', () => {
    const expectRecreatedAfter = (updateBinding: () => void) => {
      const previousShape = fixture.componentInstance.regularShape.instance;

      updateBinding();
      fixture.detectChanges(false);

      expect(fixture.componentInstance.regularShape.instance).not.toBe(previousShape);
      expect(fixture.componentInstance.style.instance.getImage()).toBe(
        fixture.componentInstance.regularShape.instance,
      );
    };

    expectRecreatedAfter(() => fixture.componentInstance.radius2.set(9));
    expectRecreatedAfter(() => fixture.componentInstance.angle.set(1));
    expectRecreatedAfter(() => fixture.componentInstance.displacement.set([2, 4]));
    expectRecreatedAfter(() => fixture.componentInstance.rotation.set(1));
    expectRecreatedAfter(() => fixture.componentInstance.rotateWithView.set(true));
    expectRecreatedAfter(() => fixture.componentInstance.scale.set(2));
    expectRecreatedAfter(() => fixture.componentInstance.declutterMode.set('obstacle'));
  });
});
