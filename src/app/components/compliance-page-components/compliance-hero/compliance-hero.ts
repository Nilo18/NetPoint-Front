import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-compliance-hero',
  templateUrl: './compliance-hero.html',
  styleUrl: './compliance-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceHero {}
