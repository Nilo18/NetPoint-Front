import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryList } from './sales-history-list';

describe('SalesHistoryList', () => {
  let component: SalesHistoryList;
  let fixture: ComponentFixture<SalesHistoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
