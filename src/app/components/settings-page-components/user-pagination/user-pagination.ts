import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';

@Component({
  selector: 'app-user-pagination',
  imports: [],
  templateUrl: './user-pagination.html',
  styleUrl: './user-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPagination {
  public settingsService = inject(SettingsPageService)
  companyId = input.required<number>()
  usersLoaded = output<User[]>()
  backendError = output<string>()
  currentPage = signal(1)
  totalPages = signal(1)
  private pageSize = 10

  async ngOnInit() {
    console.log('Received the companyId as input: ', this.companyId())
    await this.loadPage(1)
  }

  get pageArray(): number[] {
    return this.totalPages() <= 10 ?
      Array.from({ length: this.totalPages() }, (_, i) => i + 1) 
      : Array.from({ length: 10 }, (_, i) => i + 1)
  }

  get trimemdPageArray() {
    return this.pageArray.slice(0, 9)
  }

  async onPageClick(page: number) {
    if (this.currentPage() === page || this.totalPages() === 1) {
      console.log('Already on the selected page.')
      return
    }

    if (page <= 0) {
      await this.loadPage(this.totalPages())
      return
    }

    if (page > this.totalPages()) {
      console.log('The suggested page exceeds the total amount of pages.')
      await this.loadPage(1)
      return
    }

    await this.loadPage(page)
  }

  private async loadPage(page: number) {
    this.settingsService.setIsLoading(true)
    console.log('clicked page:', page, typeof page)

    try {
      const res = await this.settingsService.getUserlist(this.companyId(), page, this.pageSize)

      if (!res) {
        this.settingsService.setIsLoading(false)
        return
      }

      this.currentPage.set(res.currentPage + 1)
      this.totalPages.set(res.totalPages)
      this.usersLoaded.emit(res.userList)
      console.log('currentPage after:', this.currentPage(), typeof this.currentPage())
    } catch (error: any) {
      this.backendError.emit(error.error.error)
    }
  }
}
