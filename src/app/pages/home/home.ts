import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Banner } from '../../components/banner/banner';
import { FeaturesSection } from '../../components/features-section/features-section';
import { CallToActionComponent } from '../../components/call-to-action-component/call-to-action-component';
import { Footer } from '../../components/footer/footer';
import { PartnerCompanies } from '../../components/partner-companies/partner-companies';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Banner,
    FeaturesSection,
    PartnerCompanies,
    CallToActionComponent,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
