import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageUtilitiesService } from '../../services/page-utilities-service';
import { HeaderBurgerMenu } from '../header-burger-menu/header-burger-menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, HeaderBurgerMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class Header {
  protected readonly pageUtilities = inject(PageUtilitiesService);
  scrolled = signal(false);
  showBurgerMenu: WritableSignal<boolean> = signal(false)

  onScroll() {
    this.scrolled.set(window.scrollY > 10);
  }

  setShowBurgerMenu(val: boolean) {
    this.showBurgerMenu.set(val)
  }
}
