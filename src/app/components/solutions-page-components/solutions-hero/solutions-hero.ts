import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageUtilitiesService } from '../../../services/page-utilities-service';

@Component({
  selector: 'app-solutions-hero',
  imports: [RouterLink],
  templateUrl: './solutions-hero.html',
  styleUrl: './solutions-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionsHero {
  protected readonly pageUtilities = inject(PageUtilitiesService);
}
