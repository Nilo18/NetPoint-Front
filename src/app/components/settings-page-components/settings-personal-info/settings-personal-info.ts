import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { FormValidatorService } from '../../../services/form-validator-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoUpdateValidatorModal } from '../user-info-update-validator-modal/user-info-update-validator-modal';

@Component({
  selector: 'app-settings-personal-info',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-personal-info.html',
  styleUrl: './settings-personal-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPersonalInfo {
  private settingsService = inject(SettingsPageService)
  private fb = inject(FormBuilder)
  private formValidator = inject(FormValidatorService)
  private modalService = inject(NgbModal)
  userInfoForm!: FormGroup
  userInfo: User = {
    id: -1,
    name: '',
    email: '',
    role: ''
  }

  async ngOnInit() {
    this.userInfoForm = this.fb.group({
      id: [-1 , [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]]
    })

    try {
      const res = await this.settingsService.getUserInfo()
      this.userInfo = res

      console.log('The new userInfo is: ', this.userInfo)

      console.log('HELLO WORLD')
      this.userInfoForm.patchValue({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role
      })
      // console.log('userInfoForm after patching new values: ', this.userInfoForm.value)
      // console.log('role control:', this.userInfoForm.get('role')?.value);
    } catch (error) {
      console.log(error)
    }
  }

  getError(field: string, form: FormGroup) {
    return this.formValidator.getError(field, form)
  }

  async onSubmit() {
    if (JSON.stringify(this.userInfo) === JSON.stringify(this.userInfoForm.value)) {
      console.log('Form has not changed, avoiding request')
      return
    }

    if (this.userInfoForm.invalid) {
      this.userInfoForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    try {
      console.log(this.userInfoForm.value)
      const res = await this.settingsService.verifyPersonalInfoUpdateRequest(this.userInfoForm.value)
      if (res) {
        this.modalService.open(UserInfoUpdateValidatorModal, {
          centered: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
