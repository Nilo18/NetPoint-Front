import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInfo } from './business-info';

describe('BusinessInfo', () => {
  let component: BusinessInfo;
  let fixture: ComponentFixture<BusinessInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
