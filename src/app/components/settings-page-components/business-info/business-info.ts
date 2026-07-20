import { Component, effect, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { SettingsHeader } from '../settings-header/settings-header';
import { SettingsSidebar } from '../settings-sidebar/settings-sidebar';
import { SettingsPageService } from '../../../services/settings-page-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtPayload } from 'jwt-decode';
import { DecodedToken, TokenService } from '../../../services/token-service';
import { FormValidatorService } from '../../../services/form-validator-service';
import { Subject, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsBusinessInfoValidatorModal } from '../settings-business-info-validator-modal/settings-business-info-validator-modal';
import { BackendErrorOverlay } from '../../backend-error-overlay/backend-error-overlay';
import { Router } from '@angular/router';
import { SettingsBusinessInfoSchemaCustomization } from '../settings-business-info-schema-customization/settings-business-info-schema-customization';
import { BackendErrorHandlerService } from '../../../services/backend-error-handler-service';
import { ImageUploadProcessorService } from '../../../services/image-upload-processor-service';

@Component({
  selector: 'app-business-info',
  imports: [ReactiveFormsModule, SettingsBusinessInfoSchemaCustomization],
  templateUrl: './business-info.html',
  styleUrl: './business-info.scss',
})
export class BusinessInfo {
  private settingsService = inject(SettingsPageService)
  private tokenService = inject(TokenService)
  private formValidator = inject(FormValidatorService)
  private modalService = inject(NgbModal)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private backendErrorHandler = inject(BackendErrorHandlerService)
  private imageUploadProcessor = inject(ImageUploadProcessorService)
  decodedToken!: DecodedToken | null
  businessForm!: FormGroup
  formValueChanged: boolean = false
  gotBackendError: WritableSignal<boolean> = signal(false)
  errMsg: WritableSignal<string> = signal('')
  requestSent: WritableSignal<boolean> = signal(false)
  deleteRequestSent: WritableSignal<boolean> = signal(false)
  deleteErrMsg: WritableSignal<string> = signal('')
  deleteSuccessMsg: WritableSignal<string> = signal('')
  isLoading: WritableSignal<boolean> = signal(true)
  readonly isImageDragged = signal(false)
  readonly selectedImage = signal<File | null>(null)
  readonly oldImagePreview = signal<string | null | undefined>(null)
  readonly imagePreview = signal<string | null | undefined>(null)
  readonly imageError = signal('')
  oldValue = {
    id: -1,
    name: '', 
    email: '',
    industry: ''
  }

  async ngOnInit() {
    console.log('Backend error message on business-info section is: ', this.errMsg())
    this.businessForm = this.fb.group({
      id: [-1 , Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      industry: ['', Validators.required]
    })

    this.decodedToken = this.tokenService.getDecodedToken()

    if (!this.decodedToken) {
      console.log('Invalid decoded token: ', this.decodedToken)
      return
    }

    try {
      const res = await this.settingsService.getCompanyById(this.decodedToken.companyId)

      this.isLoading.set(false)

      this.oldValue.id = res.id
      this.oldValue.name = res.name
      this.oldValue.email = res.email
      this.oldValue.industry = res.industry

      this.businessForm.patchValue({
        id: res.id,
        name: res.name,
        email: res.email,
        industry: res.industry
      })
      this.oldImagePreview.set(res.logo)
      this.imagePreview.set(res.logo)
    } catch (error: unknown) {
      this.gotBackendError.set(true)
      this.errMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Could not load business information.'))
    }
  }

  // constructor() {
  //   effect(() => {

  //   })
  // }

  getRequiredError(field: string, form: FormGroup): string {
    return this.formValidator.getRequiredError(field, form)
  }

  getEmailError(field: string, form: FormGroup): string {
    return this.formValidator.getFirstError(
      this.formValidator.getRequiredError(field, form),
      this.formValidator.getEmailError(field, form)
    )
  }

  onImageDragOver(event: DragEvent) {
    this.imageUploadProcessor.onDragOver(event, this.isImageDragged)
  }

  onImageDragLeave(event: DragEvent) {
    this.imageUploadProcessor.onDragLeave(event, this.isImageDragged)
  }

  onImageDrop(event: DragEvent) {
    this.imageUploadProcessor.onDrop(event, this.imageUploadState)
  }

  onImageSelected(event: Event) {
    this.imageUploadProcessor.onFileSelected(event, this.imageUploadState)
  }

  @ViewChild('businessImageInput') businessImageInput?: ElementRef<HTMLInputElement>

  removeImage(event: MouseEvent) {
    this.imageUploadProcessor.removeImage(
      event,
      this.imageUploadState,
      this.businessImageInput?.nativeElement,
    )
  }

  private get imageUploadState() {
    return {
      isDragged: this.isImageDragged,
      selectedFile: this.selectedImage,
      preview: this.imagePreview,
      error: this.imageError,
      previousPreview: this.oldImagePreview,
    }
  }

  async onSubmit() {
    // console.log('Comparing: ', this.businessForm.value)
    // console.log('To the old value', this.oldValue)

    if (this.requestSent() === true) {
      console.log('Request already sent')
      return
    }

    if (JSON.stringify(this.businessForm.value) === JSON.stringify(this.oldValue) && 
        this.imagePreview() === this.oldImagePreview()) {
      console.log('Form value has not changed, avoiding redundant request')
      return
    }

    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched()
      console.log('Invalid form.')
      return
    }

    this.requestSent.set(true)
    this.gotBackendError.set(false)
    this.errMsg.set('')

    console.log(this.businessForm.value)
    try {
      const res = await this.settingsService.sendCompanyBusinessInfoUpdateRequest(this.businessForm.value)
      if (res) {
        this.openVerificationModal(res.tempToken)
        this.requestSent.set(false)
      }
    } catch (error: unknown) {
      this.requestSent.set(false)
      this.gotBackendError.set(true)
      this.errMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Could not update business information. Please try again.'))
    }
  }

  openVerificationModal(tempToken: string, event?: MouseEvent) {
    // (event.target as HTMLElement).blur()

    const modalRef = this.modalService.open(SettingsBusinessInfoValidatorModal, {
      centered: true
    })

    modalRef.componentInstance.tempToken = tempToken
    modalRef.componentInstance.companyInfo = this.businessForm.value
    modalRef.componentInstance.selectedImage = this.selectedImage()
    if (JSON.stringify(this.businessForm.value) !== JSON.stringify(this.oldValue) && 
        this.imagePreview() === this.oldImagePreview()) {
      modalRef.componentInstance.shouldRemoveImage = false
    } else {
      modalRef.componentInstance.shouldRemoveImage = true
    }

    return modalRef
  }

  async deleteBusinessAccount() {
    if (!this.decodedToken) {
      this.deleteErrMsg.set('Unable to identify the current business account.')
      return
    }

    const confirmed = window.confirm(
      'Delete this business account? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    this.deleteRequestSent.set(true)
    this.deleteErrMsg.set('')
    this.deleteSuccessMsg.set('')

    try {
      await this.settingsService.deleteCompany(this.decodedToken.companyId)
      this.deleteSuccessMsg.set('Business account deleted.')
      this.tokenService.clearToken()
      await this.router.navigate(['/'])
    } catch (error: unknown) {
      this.deleteErrMsg.set(this.backendErrorHandler.getErrorMessage(error, 'Could not delete business account. Please try again.'))
    } finally {
      this.deleteRequestSent.set(false)
    }
  }
}
