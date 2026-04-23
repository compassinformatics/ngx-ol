import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { DEMOS } from './demos';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'handleDocumentClick($event)',
  },
})
export class App {
  private readonly menu = viewChild<ElementRef<HTMLDetailsElement>>('menu');
  private readonly router = inject(Router);
  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url.split('?')[0] ?? '/'),
      startWith(this.router.url.split('?')[0] ?? '/'),
    ),
    { requireSync: true },
  );

  readonly demos = DEMOS;
  readonly activeDemo = computed(
    () => this.demos.find((demo) => demo.path === this.currentPath()) ?? null,
  );
  readonly shiftedDescriptions = signal<ReadonlySet<string>>(new Set());
  readonly isDescriptionShifted = computed(() => {
    const demo = this.activeDemo();

    return !!demo && this.shiftedDescriptions().has(demo.path);
  });

  protected handleDocumentClick(event: MouseEvent): void {
    const menu = this.menu()?.nativeElement;
    const target = event.target;

    if (!menu?.open || !(target instanceof Node) || menu.contains(target)) {
      return;
    }

    menu.removeAttribute('open');
  }

  protected toggleDescriptionPosition(path: string): void {
    this.shiftedDescriptions.update((shifted) => {
      const next = new Set(shifted);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }
}
