import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { jwtDecode } from 'jwt-decode';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsAddUserModal } from '../settings-add-user-modal/settings-add-user-modal';
import { UserPagination } from '../user-pagination/user-pagination';
import { UserDeletionErrorDisplayModal } from '../user-deletion-error-display-modal/user-deletion-error-display-modal';
import { SettingsRolePermissions } from '../settings-role-permissions/settings-role-permissions';
import { BackendErrorOverlay } from '../../backend-error-overlay/backend-error-overlay';

@Component({
  selector: 'app-settings-user-management',
  imports: [UserPagination, SettingsRolePermissions, BackendErrorOverlay],
  templateUrl: './settings-user-management.html',
  styleUrl: './settings-user-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsUserManagement {
  public settingsService = inject(SettingsPageService)
  private modalService = inject(NgbModal)
  userList = signal<User[]>([])
  gotBackendError = signal(false)
  gotSearchError = signal(false)
  backendErrMsg = signal('')
  decodedTokenCompanyId = signal<number | null>(null)

  ngOnInit() {
    const token = localStorage.getItem('net_token') 

    if (token) {
      const decodedToken = jwtDecode<{ companyId: string | number }>(token)
      const companyId = Number(decodedToken.companyId)
      this.decodedTokenCompanyId.set(companyId)
    } else {
      console.log('Token missing.')
      this.settingsService.setIsLoading(false)
    }
  }

  open(event: MouseEvent) {
    // console.log('Open modal method runs')
    (event.target as HTMLElement).blur()
    const modalRef = this.modalService.open(SettingsAddUserModal, {
      centered: true
    })

    modalRef.result.then(
      (result) => console.log('Confirmed!'),
      (reason) => console.log('Dismissed!')
    )
  }

  async deleteUser(userId: number) {
    this.settingsService.setIsLoading(true)
    try {
      await this.settingsService.deleteUser(userId)
      this.userList.update(users => users.filter(user => user.id !== userId))
      if (this.userList().length === 0) {
        const res = await this.settingsService.getUserlist(this.decodedTokenCompanyId()!, 1, 10)
        if (res) {
          this.userList.set(res.userList)
          // this.settingsService.setIsLoading(false)
          // this.gotSearchError.set(false)
          // this.backendErrMsg.set('')
          // return
        }
      }
      this.settingsService.setIsLoading(false)
    } catch (error: any) {
      const modalRef = this.modalService.open(UserDeletionErrorDisplayModal, {
        centered: true
      })

      modalRef.componentInstance.errMsg = error.error.error
    }
  }

  setUsers(users: User[]) {
    this.userList.set(users)
    this.gotBackendError.set(false)
    this.backendErrMsg.set('')
    this.settingsService.setIsLoading(false)
  }

  showBackendError(errorMsg: string) {
    this.gotBackendError.set(true)
    this.backendErrMsg.set(errorMsg)
    this.settingsService.setIsLoading(false)
  }

  async searchUser(searchTerm: string) {
    if (!searchTerm.trim()) {
      // *** Show the first page as default if the search term is empty ***
      this.settingsService.setIsLoading(true)
      const res = await this.settingsService.getUserlist(this.decodedTokenCompanyId()!, 1, 10)
      if (res) {
        this.userList.set(res.userList)
        this.settingsService.setIsLoading(false)
        this.gotSearchError.set(false)
        this.backendErrMsg.set('')
        return
      }
    }

    this.settingsService.setIsLoading(true)
    this.gotSearchError.set(false)
    this.backendErrMsg.set('')

    try {
      const users = await this.settingsService.searchUsers(searchTerm)
      this.userList.set(users)
    } catch (error: any) {
      this.gotSearchError.set(true)
      this.backendErrMsg.set(error.error.error)
    } finally {
      this.settingsService.setIsLoading(false)
    }
  }
}
