import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageSlider } from './home-page-slider';

describe('HomePageSlider', () => {
  let component: HomePageSlider;
  let fixture: ComponentFixture<HomePageSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
