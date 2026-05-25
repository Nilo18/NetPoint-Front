import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';

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
}
