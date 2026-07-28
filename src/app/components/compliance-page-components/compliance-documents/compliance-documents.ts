import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-compliance-documents',
  imports: [RouterLink],
  templateUrl: './compliance-documents.html',
  styleUrl: './compliance-documents.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceDocuments {}
