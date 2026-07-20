import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { SettingsPageService, User } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorService } from '../../../services/form-validator-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoUpdateValidatorModal } from '../user-info-update-validator-modal/user-info-update-validator-modal';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';
import { ImageUploadProcessorService } from '../../../services/image-upload-processor-service';

interface UserInfoFormValue extends User {
  newPassword: string | null
}

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
  private backendErrorHandler = inject(BackendErrorHandlerService)
  public imageProcessor = inject(ImageUploadProcessorService)
  userInfoForm!: FormGroup
  userInfo: UserInfoFormValue = {
    id: -1,
    name: '',
    email: '',
    role: '',
    newPassword: null
  }
  gotBackendError: WritableSignal<boolean> = signal(false)
  errMsg: WritableSignal<string> = signal('')
  requestSent: WritableSignal<boolean> = signal(false)
  isLoading: WritableSignal<boolean> = signal(true)
  selectedFile = signal<File | null>(null)
  imagePreview = signal<string | null | undefined>(null)
  readonly oldImagePreview = signal<string | null | undefined>(null)
  imageError = signal('')
  readonly shouldRemoveImage = signal(false)

  async ngOnInit() {
    this.userInfoForm = this.fb.group({
      id: [-1 , [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      newPassword: [null, [Validators.minLength(8)]]
    })

    try {
      const res = await this.settingsService.getUserInfo()
      // if (res.profileImage) {
      this.oldImagePreview.set(res.profileImage)
      this.imagePreview.set(res.profileImage)
      // }
      this.isLoading.set(false)

      const {profileImage, ...remainingData} = res

      this.userInfo = {
        ...remainingData,
        newPassword: null
      }

      console.log('The new userInfo is: ', this.userInfo)

      console.log('HELLO WORLD')
      this.userInfoForm.patchValue({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        newPassword: null
      })
      // console.log('userInfoForm after patching new values: ', this.userInfoForm.value)
      // console.log('role control:', this.userInfoForm.get('role')?.value);
    } catch (error: unknown) {
      this.isLoading.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
      console.log(error)
    }
  }

  public get imageUploadState() {
    return {
      isDragged: signal(false),
      selectedFile: this.selectedFile,
      preview: this.imagePreview,
      error: this.imageError,
    }
  }

  onImageSelected(event: Event) {
    this.imageProcessor.onFileSelected(event, this.imageUploadState, {
      onFileAccepted: () => this.shouldRemoveImage.set(false),
    })
  }

  removeImage(event: MouseEvent, input: HTMLInputElement) {
    this.imageProcessor.removeImage(event, this.imageUploadState, input)
    this.shouldRemoveImage.set(Boolean(this.oldImagePreview()))
  }

  getRequiredError(field: string, form: FormGroup): string {
    return this.formValidator.getRequiredError(field, form)
  }

  getEmailError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getEmailError(field, form)
    )
  }

  getNewPasswordError(field: string, form: FormGroup): string {
    return this.formValidator.getMinLengthError(field, form, 'Password')
  }

  async onSubmit() {
    if (this.requestSent() === true) {
      console.log('Request already sent')
      return
    }

    const imageChanged = this.selectedFile() !== null || this.shouldRemoveImage()
    if (JSON.stringify(this.userInfo) === JSON.stringify(this.userInfoForm.value) &&
        !imageChanged) {
      console.log('Form has not changed, avoiding request')
      return
    }

    if (this.userInfoForm.invalid) {
      this.userInfoForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    try {
      console.log(this.userInfoForm.value)
      const res = await this.settingsService.verifyPersonalInfoUpdateRequest(this.userInfoForm.value)
      if (res) {
        this.requestSent.set(false)
        const modalRef = this.modalService.open(UserInfoUpdateValidatorModal, {
          centered: true
        })

        // const { newPassword, ...payload } = this.userInfoForm.value
        modalRef.componentInstance.tempToken = res.tempToken
        // modalRef.componentInstance.newPassword = newPassword || null
        modalRef.componentInstance.userInfo = this.userInfoForm.value
        modalRef.componentInstance.selectedImage = this.selectedFile()
        modalRef.componentInstance.shouldRemoveImage = this.shouldRemoveImage()
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
      console.log(error)
    }
  }

}
