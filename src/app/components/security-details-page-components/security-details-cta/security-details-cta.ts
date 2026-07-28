import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-security-details-cta',
  imports: [RouterLink],
  templateUrl: './security-details-cta.html',
  styleUrl: './security-details-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityDetailsCta {}
