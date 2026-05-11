import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
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
  userInviteForm!: FormGroup
  // cashierAdditionForm!: FormGroup
  role: WritableSignal<string> = signal('ADMIN')
  decodedToken!: any

  constructor() {
    effect(() => {
      this.userInviteForm?.patchValue({ role: this.role() })
    })
  }

  ngOnInit() {
    const token = localStorage.getItem('net_token')
    
    if (token) {
      this.decodedToken = jwtDecode(token)

      this.userInviteForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        role: [this.role(), [Validators.required]],
        companyId: [this.decodedToken.companyId, [Validators.required]]
      })
    }
  }

  setRole(value: string) {
    console.log("setRole() is running...")
    this.role.set(value)
    console.log('The role is: ', this.role())
  }

  inviteUser() {
    if (this.userInviteForm.invalid) {
      this.userInviteForm.markAllAsTouched()
      console.log('Invalid form: ', this.userInviteForm.value)
      return
    }

    console.log(this.userInviteForm.value)
    this.settingsService.inviteAdmin(this.userInviteForm.value)
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}
