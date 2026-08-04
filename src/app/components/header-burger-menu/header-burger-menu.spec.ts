import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBurgerMenu } from './header-burger-menu';

describe('HeaderBurgerMenu', () => {
  let component: HeaderBurgerMenu;
  let fixture: ComponentFixture<HeaderBurgerMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBurgerMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBurgerMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
