import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryStats } from './sales-history-stats';

describe('SalesHistoryStats', () => {
  let component: SalesHistoryStats;
  let fixture: ComponentFixture<SalesHistoryStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
