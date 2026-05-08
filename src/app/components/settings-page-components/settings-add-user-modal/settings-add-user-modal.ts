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
  adminInviteForm!: FormGroup
  cashierAdditionForm!: FormGroup
  role: WritableSignal<string> = signal('ADMIN')
  decodedToken!: any

  constructor() {
    effect(() => {
      this.cashierAdditionForm?.patchValue({ role: this.role() })
    })
  }

  ngOnInit() {
    const token = localStorage.getItem('net_token')
    
    if (token) {
      this.decodedToken = jwtDecode(token)

      // if (this.role() === 'ADMIN') {
        this.adminInviteForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          role: [this.role(), [Validators.required]],
          companyId: [this.decodedToken.companyId, [Validators.required]]
        })
      // } else if (this.role() === 'CASHIER') {
        console.log('The role is: ', this.role())
          this.cashierAdditionForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            role: [this.role(), [Validators.required]],
            pin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            companyId: [this.decodedToken.companyId, [Validators.required]]
          })
      // } else {
      //     console.log('Invalid role.')
      //     return
      // }
    }
  }

  setRole(value: string) {
    console.log("setRole() is running...")
    this.role.set(value)
    console.log('The role is: ', this.role())
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

  addCashier() {
    if (this.cashierAdditionForm.invalid) {
      this.cashierAdditionForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    console.log(this.cashierAdditionForm.value)
    this.settingsService.addCashier(this.cashierAdditionForm.value)
    this.modal.close()
  }

  onSubmit() {
    if (this.role() === 'ADMIN') {
      this.inviteAdmin()
    } else {
      // Cashier addition logic will go here
      console.log(this.role())
      this.addCashier()
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}
