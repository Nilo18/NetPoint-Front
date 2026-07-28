import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { LegalDocument } from '../../components/legal-document/legal-document';

@Component({
  selector: 'app-privacy-page',
  imports: [Footer, Header, LegalDocument],
  templateUrl: './privacy-page.html',
  styleUrl: './privacy-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPage {}
