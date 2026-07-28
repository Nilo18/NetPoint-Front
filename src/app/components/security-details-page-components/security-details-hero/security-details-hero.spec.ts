import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SecurityDetailsHero } from './security-details-hero';

describe('SecurityDetailsHero', () => {
  let component: SecurityDetailsHero;
  let fixture: ComponentFixture<SecurityDetailsHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDetailsHero],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDetailsHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
