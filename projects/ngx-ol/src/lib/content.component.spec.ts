import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularOpenlayersModule } from '../public-api';
import { ContentComponent } from './content.component';

@Component({
  template: `
    <aol-content>
      <span>Projected content</span>
    </aol-content>
  `,
  standalone: true,
  imports: [AngularOpenlayersModule],
})
class ContentHostComponent {
  @ViewChild(ContentComponent)
  content!: ContentComponent;
}

describe('ContentComponent', () => {
  let fixture: ComponentFixture<ContentHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('exposes the projected host element through Angular queries', () => {
    expect(fixture.componentInstance.content.elementRef.nativeElement.textContent).toContain(
      'Projected content',
    );
  });
});
