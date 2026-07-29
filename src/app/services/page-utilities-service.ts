import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PageUtilitiesService {
  private readonly router = inject(Router);

  navigateToPage(route: string) {
    this.router.navigate([route]);
    window.scrollTo(0, 0);
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
