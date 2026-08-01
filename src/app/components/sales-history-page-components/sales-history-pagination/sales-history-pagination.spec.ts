import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryPagination } from './sales-history-pagination';

describe('SalesHistoryPagination', () => {
  let component: SalesHistoryPagination;
  let fixture: ComponentFixture<SalesHistoryPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
