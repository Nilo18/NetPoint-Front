import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PageUtilitiesService } from './page-utilities-service';

describe('PageUtilitiesService', () => {
  const navigate = vi.fn();
  let service: PageUtilitiesService;

  beforeEach(() => {
    navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        PageUtilitiesService,
        {
          provide: Router,
          useValue: { navigate },
        },
      ],
    });
    service = TestBed.inject(PageUtilitiesService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('navigates to a route and resets the page scroll position', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    service.navigateToPage('/pricing');

    expect(navigate).toHaveBeenCalledWith(['/pricing']);
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('smoothly scrolls the requested section into view', () => {
    const scrollIntoView = vi.fn();
    const getElementById = vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    service.scrollToSection('features-section');

    expect(getElementById).toHaveBeenCalledWith('features-section');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });
});
