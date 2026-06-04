import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { LayerTileComponent } from '../layers/layertile.component';
import { SourceTileWMSComponent } from './tilewms.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-tilewms [url]="url" [params]="params()"></aol-source-tilewms>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class SourceTileWMSHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/wms';
  params = signal<Record<string, string>>({ LAYERS: 'basic', TIME: '2026-01-01' });

  readonly source = viewChild.required<SourceTileWMSComponent>(SourceTileWMSComponent);

  readonly layer = viewChild.required<LayerTileComponent>(LayerTileComponent);
}

describe('SourceTileWMSComponent', () => {
  let fixture: ComponentFixture<SourceTileWMSHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceTileWMSHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceTileWMSHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('binds WMS params into the layer source through Angular inputs', () => {
    expect(fixture.componentInstance.layer().instance.getSource()).toBe(
      fixture.componentInstance.source().instance,
    );
    expect(fixture.componentInstance.source().instance.getParams()).toMatchObject({
      LAYERS: 'basic',
      TIME: '2026-01-01',
    });
  });

  it('updates retained WMS params without replacing the source', () => {
    const source = fixture.componentInstance.source().instance;

    fixture.componentInstance.params.set({ LAYERS: 'updated', TIME: '2026-01-01' });
    fixture.detectChanges(false);

    expect(fixture.componentInstance.source().instance).toBe(source);
    expect(fixture.componentInstance.source().instance.getParams()).toMatchObject({
      LAYERS: 'updated',
      TIME: '2026-01-01',
    });
  });

  it('replaces the source when removed WMS params would otherwise stay merged', () => {
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
  });
});
