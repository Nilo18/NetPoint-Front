import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { FormValidatorService } from '../../services/form-validator-service';
import { SignupStateManagementService } from '../../services/signup-state-management-service';
import { ImageUploadProcessorService } from '../../services/image-upload-processor-service';

@Component({
  selector: 'app-signup-first-stage-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-first-stage-form.html',
  styleUrl: './signup-first-stage-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupFirstStageForm {
  signupForm!: FormGroup
  showNextStep: WritableSignal<boolean> = signal(false)
  gotBackendError = signal(false)
  requestSent = signal(false)
  backendErrorMsg = signal('')
  readonly isImageDragged = signal(false)
  readonly imagePreview = signal<string | null>(null)
  readonly imageError = signal('')
  readonly selectedImage = signal<File | null>(null)
  private formValidator = inject(FormValidatorService)
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private signupService = inject(SignupStateManagementService)
  private imageUploadProcessor = inject(ImageUploadProcessorService)

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // confirm_password: ['', [Validators.required]],
    })

    const saved = this.signupService.stageOneData()
    if (saved) this.signupForm.patchValue(saved)
    const image = this.signupService.companyImage()
    if (image) {
      this.selectedImage.set(image)
      this.imageUploadProcessor.previewFile(image, this.imagePreview)
    }
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

  getConfirmPasswordError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getPasswordMismatchError(field, form)
    )
  }

  logInvalidControls(form: FormGroup | FormArray, path: string = ''): void {
    console.log('Received the form: ', form)
    Object.keys(form.controls).forEach(key => {
      const control = (form.controls as any)[key] as AbstractControl;
      const currentPath = path ? `${path}.${key}` : key;

      if (control.invalid) {
        if (control instanceof FormGroup || control instanceof FormArray) {
          // Recursively inspect nested groups or arrays
          this.logInvalidControls(control, currentPath);
        } else {
          // Log the exact field path and its validation errors
          console.log(`Invalid Field: ${currentPath}`, control.errors);
        }
      }
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched()
      console.log('The form is invalid: ', this.signupForm.value)
      this.logInvalidControls(this.signupForm)
      return
    }

    if (!this.showNextStep()) {
      this.signupService.setStageOneData(this.signupForm.value)
      this.signupService.setShowNextStep(this.signupForm.value ,true)
      console.log('Showing next step...')
      // return
    } 

    // return
    // else {
    //   console.log(this.signupForm.value)
    //   // return
    // }
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

  @ViewChild('companyImageInput') companyImageInput?: ElementRef<HTMLInputElement>
  removeImage(event: MouseEvent) {
    this.imageUploadProcessor.removeImage(
      event,
      this.imageUploadState,
      this.companyImageInput?.nativeElement,
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
      onFileAccepted: (file: File) => this.signupService.setCompanyImage(file),
      onFileRemoved: () => this.signupService.setCompanyImage(null),
    }
  }
}
