import { Component, inject, input } from '@angular/core';
import { SettingsPageService } from '../../../services/settings-page-service';

@Component({
  selector: 'app-user-pagination',
  imports: [],
  templateUrl: './user-pagination.html',
  styleUrl: './user-pagination.scss',
})
export class UserPagination {
  public settingsService = inject(SettingsPageService)
  companyId = input.required<number>()

  ngOnInit() {
    console.log('Received the companyId as input: ', this.companyId())
  }

  get pageArray(): number[] {
    return this.settingsService.totalPages() <= 10 ?
      Array.from({ length: this.settingsService.totalPages() }, (_, i) => i + 1) 
      : Array.from({ length: 10 }, (_, i) => i + 1)
  }

  get trimemdPageArray() {
    return this.pageArray.slice(0, 9)
  }

  async onPageClick(page: number) {
    if (this.settingsService.currentPage() === page || this.settingsService.totalPages() === 1) {
      console.log('Already on the selected page.')
      return
    }

    if (page <= 0) {
      this.settingsService.setIsLoading(true)
      await this.settingsService.getUserlist(this.companyId(), this.settingsService.totalPages(), 10)
      // this.setIsLoading(false)
      return
    }

    if (page > this.settingsService.totalPages()) {
      this.settingsService.setIsLoading(true)
      console.log('The suggested page exceeds the total amount of pages.')
      await this.settingsService.getUserlist(this.companyId(), 1, 10)
      // this.setIsLoading(false)  
      return
    }

    this.settingsService.setIsLoading(true)
    console.log('isLoading value is: ', this.settingsService.isLoading())
    console.log('clicked page:', page, typeof page)
    await this.settingsService.getUserlist(this.companyId(), page, 10)
    console.log('currentPage after:', this.settingsService.currentPage(), typeof this.settingsService.currentPage())
  }
}
