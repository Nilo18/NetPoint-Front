import { ChangeDetectorRef, Component, inject, Signal } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { jwtDecode } from 'jwt-decode';
import { JsonPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsAddUserModal } from '../settings-add-user-modal/settings-add-user-modal';
import { UserPagination } from '../user-pagination/user-pagination';

@Component({
  selector: 'app-settings-user-management',
  imports: [UserPagination],
  templateUrl: './settings-user-management.html',
  styleUrl: './settings-user-management.scss',
})
export class SettingsUserManagement {
  private settingsService = inject(SettingsPageService)
  private cdr = inject(ChangeDetectorRef)
  private modalService = inject(NgbModal)
  decodedToken!: any
  userList: Signal<User[]> = this.settingsService.userList

  async ngOnInit() {
    const token = localStorage.getItem('net_token') 

    if (token) {
      // console.log()
      this.decodedToken = jwtDecode(token)
      console.log(this.decodedToken)
      await this.settingsService.getUserlist(Number(this.decodedToken.companyId), 0, 10)
      // this.userList = res.userList
      this.cdr.detectChanges()
      console.log('The local userList is: ', this.userList)
    } else {
      console.log('Token missing.')
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

  deleteUser(userId: number) {
    this.settingsService.deleteUser(userId)
  }
}
