import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PageUtilitiesService } from '../../services/page-utilities-service';

export type LegalDocumentKind = 'privacy' | 'terms';

interface LegalSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

interface LegalContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly readTime: string;
  readonly sections: readonly LegalSection[];
}

const PRIVACY: LegalContent = {
  eyebrow: 'Legal · Privacy',
  title: 'Privacy Policy',
  summary:
    'How NetPoint handles information, why it is used, and the choices available to businesses and their users.',
  readTime: '8 min read',
  sections: [
    {
      id: 'overview',
      title: '1. Overview',
      paragraphs: [
        'NetPoint provides tools for product management, sales operations, reporting, user administration, and related business workflows. This policy describes how information is handled when you visit our public pages or use the NetPoint service.',
        'A business that creates a NetPoint workspace controls the business information and user access within that workspace. Workspace-specific requests should normally be directed to that business administrator.',
      ],
    },
    {
      id: 'information',
      title: '2. Information we collect',
      paragraphs: [
        'The information we handle depends on how you interact with NetPoint. It may be provided directly, created through use of the service, or collected automatically for operation and security.',
      ],
      bullets: [
        'Account information, such as name, email address, role, and authentication details.',
        'Business information, including profile details, products, custom attributes, inventory, and workspace settings.',
        'Operational information created through sales, administrative actions, reports, and audit activity.',
        'Technical information, such as device, browser, network, and diagnostic data.',
      ],
    },
    {
      id: 'use',
      title: '3. How information is used',
      paragraphs: [
        'We use information to provide, maintain, secure, and improve NetPoint. Business information is used to deliver and support the service.',
      ],
      bullets: [
        'Create and administer accounts and business workspaces.',
        'Provide inventory, sales, reporting, billing, and team-management functionality.',
        'Authenticate users, enforce roles, investigate issues, and maintain audit history.',
        'Communicate service, security, billing, and support information.',
      ],
    },
    {
      id: 'sharing',
      title: '4. When information may be shared',
      paragraphs: [
        'Information may be shared with service providers that help operate NetPoint, when directed by the business controlling a workspace, or when disclosure is required by law or needed to protect rights and safety.',
        'We do not sell personal information. Service providers may process information only for agreed operational purposes and are expected to protect it appropriately.',
      ],
    },
    {
      id: 'retention',
      title: '5. Retention and protection',
      paragraphs: [
        'Information is retained as needed to provide the service, meet contractual or legal obligations, resolve disputes, and maintain appropriate records. Retention periods vary by information type and workspace relationship.',
        'NetPoint uses administrative and technical safeguards intended to protect information. No system can guarantee absolute security, and users remain responsible for protecting credentials and assigning access appropriately.',
      ],
    },
    {
      id: 'choices',
      title: '6. Your choices and rights',
      paragraphs: [
        'Depending on your location, you may have rights to access, correct, delete, restrict, or receive a copy of personal information. Workspace users should first contact their business administrator for information controlled by that business.',
        'Requests concerning information controlled directly by NetPoint can be made through the support channel available in the service. Identity verification may be required.',
      ],
    },
    {
      id: 'changes',
      title: '7. Changes and contact',
      paragraphs: [
        'We may update this policy as NetPoint evolves or legal requirements change. The date above identifies the latest revision, and material changes will be communicated through an appropriate service channel.',
        'Questions can be submitted through the NetPoint support channel available in your account.',
      ],
    },
  ],
};

const TERMS: LegalContent = {
  eyebrow: 'Legal · Terms',
  title: 'Terms of Service',
  summary:
    'The rules and responsibilities that apply when a business or user accesses and uses NetPoint.',
  readTime: '10 min read',
  sections: [
    {
      id: 'agreement',
      title: '1. Agreement to these terms',
      paragraphs: [
        'These Terms govern access to and use of NetPoint. By creating an account, joining a business workspace, or using the service, you agree to these terms and confirm that you have authority to accept them for yourself or the business you represent.',
        'If you do not agree to these terms, do not access or use NetPoint.',
      ],
    },
    {
      id: 'accounts',
      title: '2. Accounts and administration',
      paragraphs: [
        'You must provide accurate account information and keep credentials secure. You are responsible for account activity unless you promptly report unauthorized access.',
        'Workspace owners and administrators are responsible for inviting users, assigning roles, managing permissions, and ensuring their business authorizes use of NetPoint.',
      ],
    },
    {
      id: 'acceptable-use',
      title: '3. Acceptable use',
      paragraphs: [
        'You may use NetPoint only for lawful business purposes and in accordance with these terms.',
      ],
      bullets: [
        'Do not bypass authentication, permissions, usage limits, or security controls.',
        'Do not introduce malicious code, probe without authorization, or disrupt availability.',
        'Do not submit unlawful content or content that infringes another person’s rights.',
        'Do not resell, copy, or reverse engineer the service except where law permits it.',
      ],
    },
    {
      id: 'business-data',
      title: '4. Business data',
      paragraphs: [
        'Your business retains its rights in information submitted to NetPoint. You grant NetPoint the limited permission needed to host, process, transmit, and display it to provide and support the service.',
        'You are responsible for the accuracy and legality of business data and for obtaining permissions required to submit information about employees, customers, products, or transactions.',
      ],
    },
    {
      id: 'plans',
      title: '5. Plans and billing',
      paragraphs: [
        'Some functionality may depend on a selected plan. Pricing, included functionality, billing periods, and renewal details will be presented when a plan is selected or changed.',
        'Unless stated otherwise, fees are non-refundable except where required by law. Plan or price changes will be communicated before they take effect.',
      ],
    },
    {
      id: 'availability',
      title: '6. Service availability',
      paragraphs: [
        'We work to keep NetPoint reliable, but the service may occasionally be unavailable because of maintenance, updates, infrastructure failures, security events, or circumstances outside reasonable control.',
        'Features may evolve. We may modify functionality while considering the impact on active customers and applicable commitments.',
      ],
    },
    {
      id: 'termination',
      title: '7. Suspension and termination',
      paragraphs: [
        'You may stop using NetPoint at any time. Workspace termination and data handling may depend on the applicable plan and account settings.',
        'We may restrict access when reasonably necessary to protect the service, respond to unlawful use, address non-payment, or enforce these terms.',
      ],
    },
    {
      id: 'liability',
      title: '8. Disclaimers and liability',
      paragraphs: [
        'NetPoint is provided on an “as available” basis to the extent permitted by law. Business decisions remain the customer’s responsibility, and reports or calculations should be reviewed for their intended use.',
        'To the extent permitted by law, neither party will be liable for indirect, incidental, special, or consequential losses. Additional limitations may appear in an applicable business agreement.',
      ],
    },
    {
      id: 'updates',
      title: '9. Updates and contact',
      paragraphs: [
        'We may update these terms to reflect service, business, or legal changes. The date above identifies the latest revision.',
        'Questions can be submitted through the NetPoint support channel available in your account.',
      ],
    },
  ],
};

@Component({
  selector: 'app-legal-document',
  imports: [],
  templateUrl: './legal-document.html',
  styleUrl: './legal-document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalDocument {
  readonly kind = input.required<LegalDocumentKind>();
  protected readonly content = computed(() => (this.kind() === 'privacy' ? PRIVACY : TERMS));
  protected readonly lastUpdated = 'July 28, 2026';
  protected readonly pageUtilities = inject(PageUtilitiesService);

  protected printDocument(): void {
    window.print();
  }
}
