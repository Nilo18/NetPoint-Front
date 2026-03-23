import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Banner } from '../../components/banner/banner';
import { FeaturesSection } from '../../components/features-section/features-section';
import { CallToActionComponent } from '../../components/call-to-action-component/call-to-action-component';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Header, Banner, FeaturesSection, CallToActionComponent, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
