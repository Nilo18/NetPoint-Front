import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solutions-cta',
  imports: [RouterLink],
  templateUrl: './solutions-cta.html',
  styleUrl: './solutions-cta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionsCta {}
