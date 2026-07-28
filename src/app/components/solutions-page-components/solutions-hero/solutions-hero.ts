import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solutions-hero',
  imports: [RouterLink],
  templateUrl: './solutions-hero.html',
  styleUrl: './solutions-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionsHero {
  protected scrollToSolutions(): void {
    document
      .getElementById('solutions-capabilities')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
