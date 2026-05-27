import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from './layertile.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile [opacity]="opacity"></aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerTileHostComponent {
  center = [0, 0];
  zoom = 2;
  opacity = 0.4;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('LayerTileComponent', () => {
  let fixture: ComponentFixture<LayerTileHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerTileHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerTileHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates a tile layer from template inputs', () => {
    expect(fixture.componentInstance.layer.instance.getOpacity()).toBe(0.4);
  });
});
