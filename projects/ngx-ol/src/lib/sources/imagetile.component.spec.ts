import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { SourceImageTileComponent } from './imagetile.component';
import { LayerWebGLTileComponent } from '../layers/layerwebgltile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-webgltile>
        <aol-source-imagetile [url]="url"></aol-source-imagetile>
      </aol-layer-webgltile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceImageTileHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/{z}/{x}/{y}.png';

  @ViewChild(SourceImageTileComponent)
  source!: SourceImageTileComponent;

  @ViewChild(LayerWebGLTileComponent)
  layer!: LayerWebGLTileComponent;
}

describe('SourceImageTileComponent', () => {
  let fixture: ComponentFixture<SourceImageTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceImageTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceImageTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds its image tile source into the WebGL tile layer through Angular inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
  });
});
