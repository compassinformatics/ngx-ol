import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceBingmapsComponent } from './bingmaps.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-bingmaps
          [key]="apiKey"
          [imagerySet]="imagerySet"
          [culture]="culture"
          [hidpi]="hidpi"
        ></aol-source-bingmaps>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceBingMapsHostComponent {
  center = [0, 0];
  zoom = 2;
  apiKey = 'test-key';
  imagerySet: 'Road' | 'Aerial' | 'AerialWithLabels' | 'collinsBart' | 'ordnanceSurvey' =
    'Road';
  culture = 'en-IE';
  hidpi = true;

  @ViewChild(SourceBingmapsComponent)
  source!: SourceBingmapsComponent;

  @ViewChild(LayerTileComponent)
  layer!: LayerTileComponent;
}

describe('SourceBingmapsComponent', () => {
  let fixture: ComponentFixture<SourceBingMapsHostComponent>;

  beforeEach(async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        statusCode: 200,
        statusDescription: 'OK',
        authenticationResultCode: 'ValidCredentials',
        resourceSets: [
          {
            resources: [
              {
                imageHeight: 256,
                imageWidth: 256,
                zoomMin: 1,
                zoomMax: 3,
                imageUrl: 'https://tiles/{subdomain}/{quadkey}',
                imageUrlSubdomains: ['t0'],
              },
            ],
          },
        ],
      }),
    } as Response);

    await TestBed.configureTestingModule({
      imports: [SourceBingMapsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceBingMapsHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fixture.destroy();
  });

  it('binds Bing Maps options into the tile layer through Angular inputs', () => {
    expect(fixture.componentInstance.layer.instance.getSource()).toBe(
      fixture.componentInstance.source.instance,
    );
    expect(fixture.componentInstance.source.instance.getApiKey()).toBe('test-key');
    expect(fixture.componentInstance.source.instance.getImagerySet()).toBe('Road');
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });
});
