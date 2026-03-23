import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompanies } from './partner-companies';

describe('PartnerCompanies', () => {
  let component: PartnerCompanies;
  let fixture: ComponentFixture<PartnerCompanies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerCompanies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerCompanies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
