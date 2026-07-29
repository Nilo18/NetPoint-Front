import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageUtilitiesService } from '../../services/page-utilities-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class Header {
  protected readonly pageUtilities = inject(PageUtilitiesService);
  scrolled = signal(false);

  onScroll() {
    this.scrolled.set(window.scrollY > 10);
  }
}
