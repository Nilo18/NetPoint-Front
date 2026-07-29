import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageUtilitiesService } from '../../services/page-utilities-service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly pageUtilities = inject(PageUtilitiesService);
}
