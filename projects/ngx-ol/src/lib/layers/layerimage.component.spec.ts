import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerImageComponent } from './layerimage.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-image [opacity]="opacity"></aol-layer-image>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LayerImageHostComponent {
  center = [0, 0];
  zoom = 2;
  opacity = 0.5;

  @ViewChild(LayerImageComponent)
  layer!: LayerImageComponent;
}

describe('LayerImageComponent', () => {
  let fixture: ComponentFixture<LayerImageHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerImageHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerImageHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('creates an image layer from template inputs', () => {
    expect(fixture.componentInstance.layer.instance.getOpacity()).toBe(0.5);
  });
});
