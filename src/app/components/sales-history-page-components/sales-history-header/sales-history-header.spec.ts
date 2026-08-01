import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryHeader } from './sales-history-header';

describe('SalesHistoryHeader', () => {
  let component: SalesHistoryHeader;
  let fixture: ComponentFixture<SalesHistoryHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
