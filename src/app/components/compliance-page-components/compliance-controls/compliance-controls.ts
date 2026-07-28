import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-compliance-controls',
  templateUrl: './compliance-controls.html',
  styleUrl: './compliance-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceControls {}
