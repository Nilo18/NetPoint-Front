import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-security-details-hero',
  imports: [RouterLink],
  templateUrl: './security-details-hero.html',
  styleUrl: './security-details-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityDetailsHero {
  protected scrollToControls(): void {
    document
      .getElementById('security-controls')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
