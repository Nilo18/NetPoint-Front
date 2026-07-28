import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalDocument } from './legal-document';

describe('LegalDocument', () => {
  let fixture: ComponentFixture<LegalDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalDocument],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalDocument);
    fixture.componentRef.setInput('kind', 'privacy');
    await fixture.whenStable();
  });

  it('renders the selected legal document', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Privacy Policy');
  });
});
