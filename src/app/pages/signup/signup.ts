import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthBanner } from '../../components/auth-banner/auth-banner';
import { SignupFirstStageForm } from '../../components/signup-first-stage-form/signup-first-stage-form';
import { SignupStateManagementService } from '../../services/signup-state-management-service';
import { SignupSecondStageForm } from '../../components/signup-second-stage-form/signup-second-stage-form';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, AuthBanner, SignupFirstStageForm, SignupSecondStageForm],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  public signupService = inject(SignupStateManagementService)
  public currentStepLabel = computed(() => {
    return this.signupService.showNextStep() 
    ? 'Step 2 of 2: Personal Account Setup' 
    : 'Step 1 of 2: Business Credentials'
  })

  ngOnInit() {
    this.signupService.hardRefreshSignupState()
  }
}
