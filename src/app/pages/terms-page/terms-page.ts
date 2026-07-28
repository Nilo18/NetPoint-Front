import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { LegalDocument } from '../../components/legal-document/legal-document';

@Component({
  selector: 'app-terms-page',
  imports: [Footer, Header, LegalDocument],
  templateUrl: './terms-page.html',
  styleUrl: './terms-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsPage {}
