import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryPage } from './sales-history-page';

describe('SalesHistoryPage', () => {
  let component: SalesHistoryPage;
  let fixture: ComponentFixture<SalesHistoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
