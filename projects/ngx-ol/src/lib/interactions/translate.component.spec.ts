import { Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { TranslateInteractionComponent } from './translate.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-translate
        [features]="features"
        [hitTolerance]="hitTolerance()"
        (translateStart)="translateStart($event)"
        (translating)="translating($event)"
        (translateEnd)="translateEnd($event)"
        (olChange)="change($event)"
        (changeActive)="changeActive($event)"
        (olError)="error($event)"
        (propertyChange)="propertyChange($event)"
      ></aol-interaction-translate>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class TranslateInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  hitTolerance = signal(3);
  features = new Collection([new Feature()]);
  translateStart = vi.fn();
  translating = vi.fn();
  translateEnd = vi.fn();
  change = vi.fn();
  changeActive = vi.fn();
  error = vi.fn();
  propertyChange = vi.fn();

  @ViewChild(TranslateInteractionComponent)
  interaction!: TranslateInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('TranslateInteractionComponent', () => {
  let fixture: ComponentFixture<TranslateInteractionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslateInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('adds a translate interaction to the map and forwards OpenLayers events', () => {
    const host = fixture.componentInstance;

    expect(host.map.instance.getInteractions().getArray()).toContain(host.interaction.instance);

    host.interaction.instance.dispatchEvent('translatestart');
    host.interaction.instance.dispatchEvent('translating');
    host.interaction.instance.dispatchEvent('translateend');
    host.interaction.instance.dispatchEvent('change');
    host.interaction.instance.dispatchEvent('change:active');
    host.interaction.instance.dispatchEvent('error');
    host.interaction.instance.dispatchEvent('propertychange');

    expect(host.translateStart).toHaveBeenCalledOnce();
    expect(host.translating).toHaveBeenCalledOnce();
    expect(host.translateEnd).toHaveBeenCalledOnce();
    expect(host.change).toHaveBeenCalledOnce();
    expect(host.changeActive).toHaveBeenCalledOnce();
    expect(host.error).toHaveBeenCalledOnce();
    expect(host.propertyChange).toHaveBeenCalledOnce();
  });

  it('updates hit tolerance without recreating the interaction', () => {
    const host = fixture.componentInstance;
    const previousInteraction = host.interaction.instance;

    host.hitTolerance.set(9);
    fixture.detectChanges();

    expect(host.interaction.instance).toBe(previousInteraction);
    expect(host.map.instance.getInteractions().getArray()).toContain(previousInteraction);
    expect(host.interaction.instance.getHitTolerance()).toBe(9);
  });
});
