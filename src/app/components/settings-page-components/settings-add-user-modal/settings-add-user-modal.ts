import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { SettingsPageService } from '../../../services/settings-page-service';
import { FormValidatorService } from '../../../services/form-validator-service';

@Component({
  selector: 'app-settings-add-user-modal',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './settings-add-user-modal.html',
  styleUrl: './settings-add-user-modal.scss',
})
export class SettingsAddUserModal {
  public modal = inject(NgbActiveModal);
  private fb = inject(FormBuilder)
  private settingsService = inject(SettingsPageService)
  private formValidator = inject(FormValidatorService)
  adminInviteForm!: FormGroup
  role: WritableSignal<string> = signal('ADMIN')
  decodedToken!: any

  ngOnInit() {
    const token = localStorage.getItem('net_token')
    
    if (token) {
      this.decodedToken = jwtDecode(token)

      this.adminInviteForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        role: [this.role(), [Validators.required]],
        companyId: [this.decodedToken.companyId, [Validators.required]]
      })
    }
  }

  setRole(value: string) {
    this.role.set(value)
  }

  inviteAdmin() {
    if (this.adminInviteForm.invalid) {
      this.adminInviteForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    console.log(this.adminInviteForm.value)
    this.settingsService.inviteAdmin(this.adminInviteForm.value)
  }

  onSubmit() {
    if (this.role() === 'ADMIN') {
      this.inviteAdmin()
    } else {
      // Cashier addition logic will go here
      console.log(this.role())
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}
