import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginFirstStageForm } from './admin-login-first-stage-form';

describe('AdminLoginFirstStageForm', () => {
  let component: AdminLoginFirstStageForm;
  let fixture: ComponentFixture<AdminLoginFirstStageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginFirstStageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginFirstStageForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
