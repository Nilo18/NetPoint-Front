import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthBanner } from '../../components/auth-banner/auth-banner';
import { AdminLoginFirstStageForm } from '../../components/login-components/admin-login-first-stage-form/admin-login-first-stage-form';
import { AdminLoginSecondStageForm } from '../../components/login-components/admin-login-second-stage-form/admin-login-second-stage-form';
import { LoginStateManagementService } from '../../services/login-state-management-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthBanner, FormsModule, 
    AdminLoginFirstStageForm,
    AdminLoginSecondStageForm
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showNextStep: WritableSignal<boolean> = signal(false)
  public loginStateService = inject(LoginStateManagementService)
  
  checkboxValues = {
    owner: signal(true),
    admin: signal(false),
    cashier: signal(false)
  }

  ngOnInit() {
    this.loginStateService.hardRefreshLoginState()
  }

  setCheckboxValue(field: string) {
    const stdField = field.trim().toLocaleLowerCase()
    if (stdField === '') return

    // update the form control
    this.loginStateService.setRole(stdField)

    this.checkboxValues.owner.set(stdField === 'owner')
    this.checkboxValues.admin.set(stdField === 'admin')
    this.checkboxValues.cashier.set(stdField === 'cashier')
  }

  setShowNextStep(val: boolean) {
    this.loginStateService.setShowLoginNextStep(val)
    // this.showNextStep.set(val)
    console.log('Set showNextStep to: ', val)
  }
}
