import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceZoomifyComponent } from './zoomify.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-zoomify [url]="url" [size]="size"></aol-source-zoomify>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceZoomifyHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/zoomify/';
  size: [number, number] = [1024, 1024];

  readonly source = viewChild.required<SourceZoomifyComponent>(SourceZoomifyComponent);

  readonly layer = viewChild.required<LayerTileComponent>(LayerTileComponent);
}

describe('SourceZoomifyComponent', () => {
  let fixture: ComponentFixture<SourceZoomifyHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceZoomifyHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceZoomifyHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds a Zoomify source into the tile layer through template inputs', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
  });
});
