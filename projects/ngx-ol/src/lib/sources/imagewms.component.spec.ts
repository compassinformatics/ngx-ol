import { Component, signal, ViewChild } from '@angular/core';
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
          [url]="url()"
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
  url = signal('https://example.com/wms');
  params = signal({ LAYERS: 'basic' });
  loadStarts = 0;

  @ViewChild(SourceImageWMSComponent)
  source!: SourceImageWMSComponent;

  @ViewChild(LayerImageComponent)
  layer!: LayerImageComponent;
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
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'basic',
    });

    fixture.componentInstance.source.instance.dispatchEvent('imageloadstart');
    expect(fixture.componentInstance.loadStarts).toBe(1);

    const previousSource = fixture.componentInstance.source.instance;

    fixture.componentInstance.params.set({ LAYERS: 'updated' });
    fixture.componentInstance.url.set('https://example.com/updated-wms');
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source.instance).toBe(previousSource);
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'updated',
    });
    expect(fixture.componentInstance.source.instance.getUrl()).toBe(
      'https://example.com/updated-wms',
    );
  });
});
