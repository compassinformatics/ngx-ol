import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceImageWMSComponent } from './imagewms.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-image>
        <aol-source-imagewms
          [url]="url"
          [params]="params()"
          (imageLoadStart)="loadStarts = loadStarts + 1"
        ></aol-source-imagewms>
      </aol-layer-image>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceImageWMSHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/wms';
  params = signal<Record<string, string>>({ LAYERS: 'basic', TIME: '2026-01-01' });
  loadStarts = 0;

  readonly source = viewChild.required<SourceImageWMSComponent>(SourceImageWMSComponent);

  readonly layer = viewChild.required<LayerImageComponent>(LayerImageComponent);
}

describe('SourceImageWMSComponent', () => {
  let fixture: ComponentFixture<SourceImageWMSHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceImageWMSHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceImageWMSHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds WMS image params and emits image load events through Angular bindings', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
    expect(fixture.componentInstance.source().instance.getParams()).toMatchObject({
      LAYERS: 'basic',
      TIME: '2026-01-01',
    });

    fixture.componentInstance.source().instance.dispatchEvent('imageloadstart');
    expect(fixture.componentInstance.loadStarts).toBe(1);

    fixture.componentInstance.params.set({ LAYERS: 'updated', TIME: '2026-01-01' });
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source().instance.getParams()).toMatchObject({
      LAYERS: 'updated',
      TIME: '2026-01-01',
    });
  });

  it('replaces the image WMS source and keeps outputs bound when params are removed', () => {
    const source = fixture.componentInstance.source().instance;

    fixture.componentInstance.params.set({ LAYERS: 'updated' });
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source().instance).not.toBe(source);
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
    const params = fixture.componentInstance.source().instance.getParams();

    expect(params).toMatchObject({
      LAYERS: 'updated',
    });
    expect(params['TIME']).toBeUndefined();

    fixture.componentInstance.source().instance.dispatchEvent('imageloadstart');
    expect(fixture.componentInstance.loadStarts).toBe(1);
  });
});
