import { Injectable, WritableSignal } from '@angular/core';

export interface ImageUploadState<TPreview extends string | null | undefined = string | null> {
  isDragged: WritableSignal<boolean>
  selectedFile: WritableSignal<File | null>
  preview: WritableSignal<TPreview>
  error: WritableSignal<string>
  previousPreview?: WritableSignal<TPreview>
}

export interface ImageUploadOptions {
  allowedTypes?: readonly string[]
  maxSizeBytes?: number
  invalidTypeMessage?: string
  oversizedFileMessage?: string
  onFileAccepted?: (file: File) => void
  onFileRemoved?: () => void
}

@Injectable({
  providedIn: 'root',
})
export class ImageUploadProcessorService {
  private readonly defaultAllowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
  private readonly defaultMaxSizeBytes = 5 * 1024 * 1024

  onDragOver(event: DragEvent, isDragged: WritableSignal<boolean>) {
    event.preventDefault()
    event.stopPropagation()
    isDragged.set(true)
  }

  onDragLeave(event: DragEvent | undefined, isDragged: WritableSignal<boolean>) {
    if (!event) {
      isDragged.set(false)
      return
    }

    const dropZone = event.currentTarget as HTMLElement | null
    const nextTarget = event.relatedTarget as Node | null
    if (!dropZone || !nextTarget || !dropZone.contains(nextTarget)) {
      isDragged.set(false)
    }
  }

  onDrop<TPreview extends string | null | undefined>(
    event: DragEvent,
    state: ImageUploadState<TPreview>,
    options: ImageUploadOptions = {},
  ) {
    event.preventDefault()
    event.stopPropagation()
    state.isDragged.set(false)

    const file = event.dataTransfer?.files.item(0)
    if (file) this.processFile(file, state, options)
  }

  onFileSelected<TPreview extends string | null | undefined>(
    event: Event,
    state: ImageUploadState<TPreview>,
    options: ImageUploadOptions = {},
  ) {
    const input = event.target as HTMLInputElement
    const file = input.files?.item(0)
    if (file) this.processFile(file, state, options)
    input.value = ''
  }

  processFile<TPreview extends string | null | undefined>(
    file: File,
    state: ImageUploadState<TPreview>,
    options: ImageUploadOptions = {},
  ) {
    state.error.set('')
    const allowedTypes = options.allowedTypes ?? this.defaultAllowedTypes
    const maxSizeBytes = options.maxSizeBytes ?? this.defaultMaxSizeBytes

    if (!allowedTypes.includes(file.type)) {
      state.error.set(options.invalidTypeMessage ?? 'Choose a PNG, JPG, JPEG, or WEBP image.')
      return false
    }

    if (file.size > maxSizeBytes) {
      state.error.set(options.oversizedFileMessage ?? 'The image must be 5 MB or smaller.')
      return false
    }

    state.previousPreview?.set(state.preview())
    state.selectedFile.set(file)
    options.onFileAccepted?.(file)
    this.previewFile(file, state.preview)
    return true
  }

  previewFile<TPreview extends string | null | undefined>(
    file: File,
    preview: WritableSignal<TPreview>,
  ) {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      preview.set(result as TPreview)
    }
    reader.readAsDataURL(file)
  }

  removeImage<TPreview extends string | null | undefined>(
    event: MouseEvent,
    state: ImageUploadState<TPreview>,
    input?: HTMLInputElement,
    options: ImageUploadOptions = {},
  ) {
    event.stopPropagation()
    state.selectedFile.set(null)
    state.preview.set(null as TPreview)
    state.error.set('')
    options.onFileRemoved?.()
    if (input) input.value = ''
  }
}
