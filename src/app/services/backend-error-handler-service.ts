import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendErrorHandlerService {
  getErrorMessage(error: unknown, fallbackMessage: string): string {
    if (!error) {
      return fallbackMessage;
    }

    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      return backendMessage || error.message || fallbackMessage;
    }

    const backendMessage = this.extractBackendMessage(error);
    if (backendMessage) {
      return backendMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallbackMessage;
  }

  getNullableErrorMessage(error: unknown, fallbackMessage: string): string | null {
    if (!error) {
      return null;
    }

    return this.getErrorMessage(error, fallbackMessage);
  }

  extractBackendMessage(errorBody: unknown): string | null {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (!errorBody || typeof errorBody !== 'object') {
      return null;
    }

    if ('message' in errorBody && typeof errorBody.message === 'string') {
      return errorBody.message;
    }

    if ('error' in errorBody) {
      if (typeof errorBody.error === 'string') {
        return errorBody.error;
      }

      return this.extractBackendMessage(errorBody.error);
    }

    if ('title' in errorBody && typeof errorBody.title === 'string') {
      return errorBody.title;
    }

    return null;
  }
}
