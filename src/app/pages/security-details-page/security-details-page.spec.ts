import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SecurityDetailsPage } from './security-details-page';

describe('SecurityDetailsPage', () => {
  let component: SecurityDetailsPage;
  let fixture: ComponentFixture<SecurityDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailsPage],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
