import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminInviteService } from '../../services/admin-invite-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../services/form-validator-service';

@Component({
  selector: 'app-admin-invite-token-validation',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-invite-token-validation.html',
  styleUrl: './admin-invite-token-validation.scss',
})
export class AdminInviteTokenValidation {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private adminInviteService = inject(AdminInviteService)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  adminSignupForm!: FormGroup
  shouldShowForm: WritableSignal<boolean> = signal(false)

  async ngOnInit() {
    const invitationToken = this.route.snapshot.queryParams['token']

    if (!invitationToken) {
      console.log('Token not found in the url or name mismatch.')
      return
    }

    console.log(invitationToken)
    const res = await this.adminInviteService.verifyInvitation(invitationToken)

    if (res.status === 200) {
      // *** Uncomment this when you finish writing this component ***
      // this.router.navigate([], {
      //   relativeTo: this.route,
      //   queryParams: {},
      //   replaceUrl: true
      // });

      this.adminSignupForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
        role: ['ADMIN']
      })

      this.shouldShowForm.set(true)
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }
}
