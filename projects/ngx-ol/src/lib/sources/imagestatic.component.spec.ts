import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceImageStaticComponent } from './imagestatic.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-image>
        <aol-source-imagestatic
          [url]="url()"
          [imageExtent]="imageExtent()"
          (imageLoadStart)="imageLoadStart($event)"
          (imageLoadEnd)="imageLoadEnd($event)"
          (imageLoadError)="imageLoadError($event)"
        ></aol-source-imagestatic>
      </aol-layer-image>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceImageStaticHostComponent {
  center = [0, 0];
  zoom = 2;
  url = signal('https://example.com/image.png');
  imageExtent = signal<[number, number, number, number]>([0, 0, 10, 10]);
  imageLoadStart = vi.fn();
  imageLoadEnd = vi.fn();
  imageLoadError = vi.fn();

  @ViewChild(SourceImageStaticComponent)
  source!: SourceImageStaticComponent;

  @ViewChild(LayerImageComponent)
  layer!: LayerImageComponent;
}

describe('SourceImageStaticComponent', () => {
  let fixture: ComponentFixture<SourceImageStaticHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceImageStaticHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceImageStaticHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('binds an image static source into the image layer through template inputs', () => {
    const host = fixture!.componentInstance;

    expect(host.layer.instance.getSource()).toBe(host.source.instance);
  });

  it('forwards image load events through template outputs', () => {
    const host = fixture!.componentInstance;

    host.source.instance.dispatchEvent('imageloadstart');
    host.source.instance.dispatchEvent('imageloadend');
    host.source.instance.dispatchEvent('imageloaderror');

    expect(host.imageLoadStart).toHaveBeenCalledOnce();
    expect(host.imageLoadEnd).toHaveBeenCalledOnce();
    expect(host.imageLoadError).toHaveBeenCalledOnce();
  });

  it('recreates and re-registers the source when the URL binding changes', () => {
    const host = fixture!.componentInstance;
    const previousSource = host.source.instance;

    host.url.set('https://example.com/updated-image.png');

    fixture!.detectChanges();

    expect(host.source.instance).not.toBe(previousSource);
    expect(host.layer.instance.getSource()).toBe(host.source.instance);
  });

  it('clears the image layer source when the source component is destroyed', () => {
    const host = fixture!.componentInstance;
    const layer = host.layer.instance;

    expect(layer.getSource()).toBe(host.source.instance);

    fixture!.destroy();
    fixture = undefined;

    expect(layer.getSource()).toBeNull();
  });
});
