import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { SourceXYZComponent } from './sources/xyz.component';
import { AttributionsComponent } from './attributions.component';

@Component({
  template: `
    <aol-map width="320px" height="240px">
      <aol-view [center]="center" [zoom]="zoom"></aol-view>
      <aol-layer-tile>
        <aol-source-xyz [url]="url">
          <aol-attributions>
            <aol-attribution>First</aol-attribution>
            <aol-attribution>Second</aol-attribution>
          </aol-attributions>
        </aol-source-xyz>
      </aol-layer-tile>
    </aol-map>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class AttributionsHostComponent {
  center = [0, 0];
  zoom = 2;
  url = 'https://example.com/{z}/{x}/{y}.png';

  @ViewChild(AttributionsComponent)
  attributions!: AttributionsComponent;

  @ViewChild(SourceXYZComponent)
  source!: SourceXYZComponent;
}

describe('AttributionsComponent', () => {
  let fixture: ComponentFixture<AttributionsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributionsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributionsHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('collects child attribution labels and applies them to the source', () => {
    expect(fixture.componentInstance.attributions.instance).toEqual(['First', 'Second']);
    expect(fixture.componentInstance.source.instance.getAttributions()?.({} as any)).toEqual([
      'First',
      'Second',
    ]);
  });
});
