import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { SecurityDetailsAccess } from '../../components/security-details-page-components/security-details-access/security-details-access';
import { SecurityDetailsControls } from '../../components/security-details-page-components/security-details-controls/security-details-controls';
import { SecurityDetailsCta } from '../../components/security-details-page-components/security-details-cta/security-details-cta';
import { SecurityDetailsHero } from '../../components/security-details-page-components/security-details-hero/security-details-hero';
import { SecurityDetailsPrinciples } from '../../components/security-details-page-components/security-details-principles/security-details-principles';

@Component({
  selector: 'app-security-details-page',
  imports: [
    Footer,
    Header,
    SecurityDetailsAccess,
    SecurityDetailsControls,
    SecurityDetailsCta,
    SecurityDetailsHero,
    SecurityDetailsPrinciples,
  ],
  templateUrl: './security-details-page.html',
  styleUrl: './security-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SecurityDetailsPage {}
