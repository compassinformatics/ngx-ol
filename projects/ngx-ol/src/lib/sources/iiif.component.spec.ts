import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceIIIFComponent } from './iiif.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-iiif [url]="url" [size]="size"></aol-source-iiif>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceIiifHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/iiif';
  size: [number, number] = [1024, 1024];

  @ViewChild(SourceIIIFComponent)
  source!: SourceIIIFComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('SourceIIIFComponent', () => {
  let fixture: ComponentFixture<SourceIiifHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceIiifHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceIiifHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds an IIIF source into the tile layer through template inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
  });
});
