import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRequestErrorDisplayModal } from './delete-request-error-display-modal';

describe('DeleteRequestErrorDisplayModal', () => {
  let component: DeleteRequestErrorDisplayModal;
  let fixture: ComponentFixture<DeleteRequestErrorDisplayModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRequestErrorDisplayModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRequestErrorDisplayModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
