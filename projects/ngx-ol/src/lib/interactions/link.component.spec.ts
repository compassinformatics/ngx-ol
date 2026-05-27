import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Params } from 'ol/interaction/Link';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../../public-api';
import { MapComponent } from '../map.component';
import { LinkInteractionComponent } from './link.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-interaction-link
        [replace]="replace"
        [prefix]="prefix"
        [params]="params"
      ></aol-interaction-link>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class LinkInteractionHostComponent {
  center = [0, 0];
  zoom = 2;
  replace = true;
  prefix = 'demo';
  params: Params[] = ['x', 'y', 'z', 'r'];

  @ViewChild(LinkInteractionComponent)
  interaction!: LinkInteractionComponent;

  @ViewChild(MapComponent)
  map!: MapComponent;
}

describe('LinkInteractionComponent', () => {
  let fixture: ComponentFixture<LinkInteractionHostComponent> | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkInteractionHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkInteractionHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('adds and removes a link interaction with the host map lifecycle', () => {
    const host = fixture!.componentInstance;
    const map = host.map.instance;
    const interaction = host.interaction.instance;

    expect(map.getInteractions().getArray()).toContain(interaction);

    fixture!.destroy();
    fixture = undefined;

    expect(map.getInteractions().getArray()).not.toContain(interaction);
  });
});
