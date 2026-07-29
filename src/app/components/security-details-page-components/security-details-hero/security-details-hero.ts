import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageUtilitiesService } from '../../../services/page-utilities-service';

@Component({
  selector: 'app-security-details-hero',
  imports: [RouterLink],
  templateUrl: './security-details-hero.html',
  styleUrl: './security-details-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityDetailsHero {
  protected readonly pageUtilities = inject(PageUtilitiesService);
}
