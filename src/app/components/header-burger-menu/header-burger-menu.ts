import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageUtilitiesService } from '../../services/page-utilities-service';

@Component({
  selector: 'app-header-burger-menu',
  imports: [RouterLink],
  templateUrl: './header-burger-menu.html',
  styleUrl: './header-burger-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class HeaderBurgerMenu {
  readonly closed = output<void>();
  readonly pageUtilities = inject(PageUtilitiesService)

  closeMenu(): void {
    this.closed.emit();
  }
}
