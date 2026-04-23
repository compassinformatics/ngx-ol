import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { AngularOpenlayersModule, MapComponent } from 'ngx-ol';
import type { Coordinate } from 'ol/coordinate';
import type BaseEvent from 'ol/events/Event';
import { transform } from 'ol/proj';

type RenderEvent = BaseEvent & {
  context: CanvasRenderingContext2D;
};

type SwipeGestureEvent = {
  deltaX: number;
  preventDefault(): void;
  srcEvent: {
    view?: Window | null;
  };
};

@Component({
  selector: 'app-swipe',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AngularOpenlayersModule],
  templateUrl: './swipe.html',
  styleUrl: './swipe.less',
  host: {
    '(window:resize)': 'resetSwipe()',
  },
})
export class Swipe {
  private readonly map = viewChild.required<MapComponent>('map');
  private readonly startX = signal(0);
  private readonly paddingSize = 16;

  readonly center = signal<Coordinate>(transform([2.181539, 47.125488], 'EPSG:4326', 'EPSG:3857'));
  readonly zoom = signal(5);
  readonly swipeValue = signal(50);
  readonly swipeOffsetToCenter = signal(0);

  readonly prerenderFunction = (event: BaseEvent): void => {
    const renderEvent = event as RenderEvent;
    const width = renderEvent.context.canvas.width * (this.swipeValue() / 100);

    renderEvent.context.save();
    renderEvent.context.beginPath();
    renderEvent.context.rect(
      width,
      0,
      renderEvent.context.canvas.width - width,
      renderEvent.context.canvas.height,
    );
    renderEvent.context.clip();
  };

  readonly postrenderFunction = (event: BaseEvent): void => {
    (event as RenderEvent).context.restore();
  };

  protected resetSwipe(): void {
    this.startX.set(0);
    this.swipeOffsetToCenter.set(0);
    this.swipeValue.set(50);
  }

  protected onPanStart(): void {
    this.startX.set(this.swipeOffsetToCenter());
  }

  protected onPan(event: Event): void {
    const swipeEvent = event as unknown as SwipeGestureEvent;

    swipeEvent.preventDefault();

    const screenSizePx =
      (swipeEvent.srcEvent.view?.innerWidth ?? window.innerWidth) - this.paddingSize;
    const maxOffset = screenSizePx * 0.48;
    const offset = Math.max(-maxOffset, Math.min(maxOffset, this.startX() + swipeEvent.deltaX));
    const positionPx = screenSizePx / 2 + offset;

    this.swipeOffsetToCenter.set(offset);
    this.swipeValue.set(Math.max(2, Math.min(98, (positionPx / screenSizePx) * 100)));
    this.map().instance.render();
  }
}
