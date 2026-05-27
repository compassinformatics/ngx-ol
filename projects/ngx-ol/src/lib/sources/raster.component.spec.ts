import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceRasterComponent } from './raster.component';
import { SourceImageStaticComponent } from './imagestatic.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-image>
        <aol-source-raster>
          <aol-source-imagestatic
            [url]="url"
            [imageExtent]="imageExtent"
          ></aol-source-imagestatic>
        </aol-source-raster>
      </aol-layer-image>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceRasterHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/image.png';
  imageExtent: [number, number, number, number] = [0, 0, 10, 10];

  @ViewChild(SourceRasterComponent)
  source!: SourceRasterComponent;

  @ViewChild(SourceImageStaticComponent)
  nestedSource!: SourceImageStaticComponent;

  @ViewChild(LayerImageComponent)
  layer!: LayerImageComponent;
}

describe('SourceRasterComponent', () => {
  let fixture: ComponentFixture<SourceRasterHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceRasterHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceRasterHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds a raster source into the image layer and uses its nested source helper', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.sources).toEqual([
      fixture.componentInstance.nestedSource.instance,
    ]);
  });
});
