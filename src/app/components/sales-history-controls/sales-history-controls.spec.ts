import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHistoryControls } from './sales-history-controls';

describe('SalesHistoryControls', () => {
  let component: SalesHistoryControls;
  let fixture: ComponentFixture<SalesHistoryControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHistoryControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
