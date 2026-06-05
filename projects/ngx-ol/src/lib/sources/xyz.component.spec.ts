import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceXYZComponent } from './xyz.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-xyz
          [url]="url()"
          (tileLoadStart)="tileLoadStart($event)"
          (tileLoadEnd)="tileLoadEnd($event)"
          (tileLoadError)="tileLoadError($event)"
        ></aol-source-xyz>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceXYZHostComponent {
  center = [0, 0];
  zoom = 2;
  url = signal('https://example.com/{z}/{x}/{y}.png');
  tileLoadStart = vi.fn();
  tileLoadEnd = vi.fn();
  tileLoadError = vi.fn();

  readonly source = viewChild.required<SourceXYZComponent>(SourceXYZComponent);

  readonly layer = viewChild.required<LayerTileComponent>(LayerTileComponent);
}

describe('SourceXYZComponent', () => {
  let fixture: ComponentFixture<SourceXYZHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceXYZHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceXYZHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('binds an XYZ source into the tile layer through template inputs', () => {
    const host = fixture!.componentInstance;

    expect(host.layer().instance.getSource()).toBe(host.source().instance);
    expect(host.source().instance.getUrls()).toEqual(['https://example.com/{z}/{x}/{y}.png']);
  });

  it('forwards tile load events through template outputs', () => {
    const host = fixture!.componentInstance;

    host.source().instance.dispatchEvent('tileloadstart');
    host.source().instance.dispatchEvent('tileloadend');
    host.source().instance.dispatchEvent('tileloaderror');

    expect(host.tileLoadStart).toHaveBeenCalledOnce();
    expect(host.tileLoadEnd).toHaveBeenCalledOnce();
    expect(host.tileLoadError).toHaveBeenCalledOnce();
  });

  it('updates the existing source URL when the URL binding changes', () => {
    const host = fixture!.componentInstance;
    const previousSource = host.source().instance;

    host.url.set('https://tiles.example.com/{z}/{x}/{y}.png');
    fixture!.detectChanges();

    expect(host.source().instance).toBe(previousSource);
    expect(host.layer().instance.getSource()).toBe(host.source().instance);
    expect(host.source().instance.getUrls()).toEqual(['https://tiles.example.com/{z}/{x}/{y}.png']);
  });

  it('clears the layer source when the source component is destroyed', () => {
    const host = fixture!.componentInstance;
    const layer = host.layer().instance;

    expect(layer.getSource()).toBe(host.source().instance);

    fixture!.destroy();
    fixture = undefined;

    expect(layer.getSource()).toBeNull();
  });
});
