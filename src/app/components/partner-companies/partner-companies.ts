import { Component } from '@angular/core';

@Component({
  selector: 'app-partner-companies',
  imports: [],
  templateUrl: './partner-companies.html',
  styleUrl: './partner-companies.scss',
})
export class PartnerCompanies {
    companies = [
    'Company A',
    'Company B',
    'Company C',
    'Company D',
    'Company E',
  ];
}
