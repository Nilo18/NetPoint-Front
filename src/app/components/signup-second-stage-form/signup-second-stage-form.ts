import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupStateManagementService } from '../../services/signup-state-management-service';
import { AuthService, SignupAuthResponse } from '../../services/auth-service';
import { FormValidatorService } from '../../services/form-validator-service';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendErrorHandlerService } from '../../services/backend-error-handler-service';
import { ImageUploadProcessorService } from '../../services/image-upload-processor-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupVerificationModal } from '../signup-verification-modal/signup-verification-modal';

@Component({
  selector: 'app-signup-second-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-second-stage-form.html',
  styleUrl: './signup-second-stage-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupSecondStageForm {
  signupFormStageTwo!: FormGroup
  private fb = inject(FormBuilder)
  public signupService = inject(SignupStateManagementService)
  private authService = inject(AuthService)
  private modalService = inject(NgbModal)
  private formValidator = inject(FormValidatorService)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  private imageUploadProcessor = inject(ImageUploadProcessorService)
  readonly isImageDragged = signal(false)
  readonly imagePreview = signal<string | null>(null)
  readonly imageError = signal('')
  readonly selectedImage = signal<File | null>(null)

  ngOnInit() {
    // console.log('Checking the type: ', typeof this.signupFormStageTwo.value);
    this.signupFormStageTwo = this.fb.group({
      owner_name: ['', [Validators.required]],
      owner_email: ['', [Validators.required, Validators.email]],
      owner_password: ['', [Validators.required, Validators.minLength(8)]],
      // phone_number: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      role: ['OWNER']
    })

    const saved = this.signupService.stageTwoData()
    if (saved) this.signupFormStageTwo.patchValue(saved)
    const image = this.signupService.profileImage()
    if (image) {
      this.selectedImage.set(image)
      this.imageUploadProcessor.previewFile(image, this.imagePreview)
    }
  }

  async onFinalSubmit() {
    if (this.signupFormStageTwo.invalid) {
      this.signupFormStageTwo.markAllAsTouched()
      console.log('The form is invalid.')
      return
    }

    if (this.signupService.showNextStep()) {
      this.signupService.setRequestSent(true)
      this.signupService.setGotBackendError(false)
      // const { confirm_password, ...payload } = this.signupForm.value
      const stageOneData = this.signupService.stageOneData()
      if (!stageOneData) {
        this.signupService.setRequestSent(false)
        this.signupService.setGotBackendError(true)
        this.signupService.setBackendErrorMsg('Signup details are missing. Please return to the previous step.')
        return
      }

      try {
        const res = await this.authService.signup2fa({
          companyEmail: stageOneData.email,
          userEmail: this.signupFormStageTwo.value.owner_email,
        })

        if (this.isSuccessfulSignupAuthResponse(res)) {
          this.signupService.setStageTwoData(this.signupFormStageTwo.value)
          this.signupService.setRequestSent(false)
          this.openVerificationModal(res)
        } else {
          throw new Error(res.status || 'Verification codes could not be sent.')
        }
      } catch (error: unknown) {
        console.log(error)
        console.log('catch block reached')
        this.signupService.setRequestSent(false)
        this.signupService.setGotBackendError(true)
        const status = error instanceof HttpErrorResponse ? error.status : undefined

        switch (status) {
          case 400:
            this.signupService.setBackendErrorMsg('Please make sure all fields are filled in correctly.')
            break;
          case 409:
            this.signupService.setBackendErrorMsg('An account with this email already exists.')
            break;
          case 500:
            this.signupService.setBackendErrorMsg('Something went wrong on our end. Please try again later.')
            break;
          default:
            this.signupService.setBackendErrorMsg(this.backendErrorHandler.getErrorMessage(error, 'Something went wrong. Please try again.'))
        }
        // this.cdr.detectChanges()
        console.log('requestSent:', this.signupService.requestSent)
        console.log('gotBackendError:', this.signupService.gotBackendError)
        console.log('backendErrorMsg:', this.signupService.backendErrorMsg)
        console.log(this.signupService.backendErrorMsg())
      }      
    }
  }

  private isSuccessfulSignupAuthResponse(response: SignupAuthResponse): boolean {
    return response.status.toLowerCase() === '2fa_required'
      && Boolean(response.companyTempToken)
      && Boolean(response.userTempToken)
  }

  private openVerificationModal(response: SignupAuthResponse) {
    const stageOneData = this.signupService.stageOneData()
    if (!stageOneData) return

    const modalRef = this.modalService.open(SignupVerificationModal, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    })

    modalRef.componentInstance.stageOneData = stageOneData
    modalRef.componentInstance.stageTwoData = this.signupFormStageTwo.getRawValue()
    modalRef.componentInstance.authResponse = response
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

  getPasswordError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getMinLengthError(field, form)
    )
  }

  getPhoneNumberError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getPatternError(field, form, 'Please enter a valid phone number')
    )
  }

  onBack() {
    this.signupService.setStageTwoData(this.signupFormStageTwo.value)
    const stageOneData = this.signupService.stageOneData()
    if (stageOneData) {
      this.signupService.setShowNextStep(stageOneData, false)
    }
  }

  onImageDragOver(event: DragEvent) {
    this.imageUploadProcessor.onDragOver(event, this.isImageDragged)
  }
  onImageDragLeave() {
    this.imageUploadProcessor.onDragLeave(undefined, this.isImageDragged)
  }
  onImageDrop(event: DragEvent) {
    this.imageUploadProcessor.onDrop(event, this.imageUploadState, this.imageUploadOptions)
  }
  onImageSelected(event: Event) {
    this.imageUploadProcessor.onFileSelected(event, this.imageUploadState, this.imageUploadOptions)
  }
  @ViewChild('profileImageInput') profileImageInput?: ElementRef<HTMLInputElement>
  removeImage(event: MouseEvent) {
    this.imageUploadProcessor.removeImage(
      event,
      this.imageUploadState,
      this.profileImageInput?.nativeElement,
      this.imageUploadOptions,
    )
  }

  private get imageUploadState() {
    return {
      isDragged: this.isImageDragged,
      selectedFile: this.selectedImage,
      preview: this.imagePreview,
      error: this.imageError,
    }
  }

  private get imageUploadOptions() {
    return {
      onFileAccepted: (file: File) => this.signupService.setProfileImage(file),
      onFileRemoved: () => this.signupService.setProfileImage(null),
    }
  }
}
