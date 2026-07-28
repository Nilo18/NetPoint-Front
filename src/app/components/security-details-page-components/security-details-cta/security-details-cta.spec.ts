import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SecurityDetailsCta } from './security-details-cta';

describe('SecurityDetailsCta', () => {
  let component: SecurityDetailsCta;
  let fixture: ComponentFixture<SecurityDetailsCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailsCta],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailsCta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
