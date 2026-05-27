import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerVectorImageComponent } from './layervectorimage.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-vectorimage [source]="source" [style]="style"></aol-layer-vectorimage>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerVectorImageHostComponent {
  center = [0, 0];
  zoom = 2;
  source = new VectorSource<Feature<Geometry>>({
    features: [new Feature(new Point([1, 2]))],
  }) as VectorSource;
  style: Style | null = new Style();

  @ViewChild(LayerVectorImageComponent)
  layer!: LayerVectorImageComponent;
}

describe('LayerVectorImageComponent', () => {
  let fixture: ComponentFixture<LayerVectorImageHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerVectorImageHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerVectorImageHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds its source and style through Angular inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source,
    );
    expect(fixture.componentInstance.layer.instance.getStyle()).toBe(
      fixture.componentInstance.style,
    );
  });
});
