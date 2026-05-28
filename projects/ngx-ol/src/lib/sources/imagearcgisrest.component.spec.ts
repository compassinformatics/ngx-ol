import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerImageComponent } from '../layers/layerimage.component';
import { SourceImageArcGISRestComponent } from './imagearcgisrest.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-image>
        <aol-source-imagearcgisrest
          [url]="url()"
          [params]="params()"
          (imageLoadStart)="loadStarts = loadStarts + 1"
        ></aol-source-imagearcgisrest>
      </aol-layer-image>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceImageArcGISRestHostComponent {
  center = [0, 0];
  zoom = 2;
  url = signal('https://example.com/arcgis/rest/services/demo/MapServer');
  params = signal({ LAYERS: 'show:1' });
  loadStarts = 0;

  @ViewChild(SourceImageArcGISRestComponent)
  source!: SourceImageArcGISRestComponent;

  @ViewChild(LayerImageComponent)
  layer!: LayerImageComponent;
}

describe('SourceImageArcGISRestComponent', () => {
  let fixture: ComponentFixture<SourceImageArcGISRestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceImageArcGISRestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceImageArcGISRestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds ArcGIS image params and emits image load events through Angular bindings', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'show:1',
    });

    fixture.componentInstance.source.instance.dispatchEvent('imageloadstart');
    expect(fixture.componentInstance.loadStarts).toBe(1);

    const previousSource = fixture.componentInstance.source.instance;

    fixture.componentInstance.params.set({ LAYERS: 'show:2' });
    fixture.componentInstance.url.set('https://example.com/arcgis/rest/services/updated/MapServer');
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source.instance).toBe(previousSource);
    expect(fixture.componentInstance.source.instance.getParams()).toMatchObject({
      LAYERS: 'show:2',
    });
    expect(fixture.componentInstance.source.instance.getUrl()).toBe(
      'https://example.com/arcgis/rest/services/updated/MapServer',
    );
  });
});
