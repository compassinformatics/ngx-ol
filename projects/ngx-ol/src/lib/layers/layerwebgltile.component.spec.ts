import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import DataTileSource from 'ol/source/DataTile';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerWebGLTileComponent } from './layerwebgltile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-webgltile [source]="source"></aol-layer-webgltile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerWebGLTileHostComponent {
  center = [0, 0];
  zoom = 2;
  source = new DataTileSource({
    loader: () => new Uint8Array([0, 0, 0, 255]),
  });

  readonly layer = viewChild.required<LayerWebGLTileComponent>(LayerWebGLTileComponent);
}

describe('LayerWebGLTileComponent', () => {
  let fixture: ComponentFixture<LayerWebGLTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerWebGLTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerWebGLTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds its WebGL tile source through Angular inputs', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source,
    );
  });
});
