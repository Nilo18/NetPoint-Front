import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ComplianceAudit } from '../../components/compliance-page-components/compliance-audit/compliance-audit';
import { ComplianceControls } from '../../components/compliance-page-components/compliance-controls/compliance-controls';
import { ComplianceDocuments } from '../../components/compliance-page-components/compliance-documents/compliance-documents';
import { ComplianceHero } from '../../components/compliance-page-components/compliance-hero/compliance-hero';
import { CompliancePayment } from '../../components/compliance-page-components/compliance-payment/compliance-payment';
import { ComplianceResponsibilities } from '../../components/compliance-page-components/compliance-responsibilities/compliance-responsibilities';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-compliance-page',
  imports: [
    ComplianceAudit,
    ComplianceControls,
    ComplianceDocuments,
    ComplianceHero,
    CompliancePayment,
    ComplianceResponsibilities,
    Footer,
    Header,
  ],
  templateUrl: './compliance-page.html',
  styleUrl: './compliance-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CompliancePage {}
