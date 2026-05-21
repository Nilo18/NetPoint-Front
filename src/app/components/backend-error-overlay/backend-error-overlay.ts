import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-backend-error-overlay',
  imports: [],
  templateUrl: './backend-error-overlay.html',
  styleUrl: './backend-error-overlay.scss',
})
export class BackendErrorOverlay {
  @Input() errorMsg = ''
}
