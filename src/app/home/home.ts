import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEMOS } from '../demos';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.less',
})
export class Home {
  readonly demos = DEMOS;
  readonly searchTerm = signal('');
  readonly filteredDemos = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();

    if (!searchTerm) {
      return this.demos;
    }

    return this.demos.filter((demo) => {
      const keywords = demo.keywords.join(' ').toLowerCase();

      return demo.label.toLowerCase().includes(searchTerm) || keywords.includes(searchTerm);
    });
  });

  protected setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }
}
