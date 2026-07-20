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
  private readonly allowedImageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
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
    event.preventDefault()
    event.stopPropagation()
    this.isImageDragged.set(true)
  }

  onImageDragLeave(event: DragEvent) {
    const dropZone = event.currentTarget as HTMLElement
    const nextTarget = event.relatedTarget as Node | null

    if (!nextTarget || !dropZone.contains(nextTarget)) {
      this.isImageDragged.set(false)
    }
  }

  onImageDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isImageDragged.set(false)

    const file = event.dataTransfer?.files.item(0)
    if (file) {
      this.processImage(file)
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.item(0)

    if (file) {
      this.processImage(file)
    }

    input.value = ''
  }

  private processImage(file: File) {
    const maxSize = 5 * 1024 * 1024
    this.imageError.set('')

    if (!this.allowedImageTypes.includes(file.type)) {
      this.imageError.set('Choose a PNG, JPG, JPEG, or WEBP image.')
      return
    }

    if (file.size > maxSize) {
      this.imageError.set('The image must be 5 MB or smaller.')
      return
    }

    this.selectedImage.set(file)
    const reader = new FileReader()
    this.oldImagePreview.set(this.imagePreview())
    reader.onload = () => this.imagePreview.set(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(file)
  }

  @ViewChild('businessImageInput') businessImageInput?: ElementRef<HTMLInputElement>

  removeImage(event: MouseEvent) {
    event.stopPropagation()
    this.selectedImage.set(null)
    this.imagePreview.set(null)
    this.imageError.set('')

    if (this.businessImageInput) {
      this.businessImageInput.nativeElement.value = ''
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
