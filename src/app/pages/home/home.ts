import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Banner } from '../../components/banner/banner';
import { FeaturesSection } from '../../components/features-section/features-section';
import { CallToActionComponent } from '../../components/call-to-action-component/call-to-action-component';
import { Footer } from '../../components/footer/footer';
import { PartnerCompanies } from '../../components/partner-companies/partner-companies';
import { HomePageSlider } from '../../components/home-page-components/home-page-slider/home-page-slider';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Banner,
    FeaturesSection,
    HomePageSlider,
    PartnerCompanies,
    CallToActionComponent,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
