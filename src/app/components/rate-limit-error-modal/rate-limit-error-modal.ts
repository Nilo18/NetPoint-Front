import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rate-limit-error-modal',
  imports: [],
  templateUrl: './rate-limit-error-modal.html',
  styleUrl: './rate-limit-error-modal.scss',
})
export class RateLimitErrorModal {
  secondsLeft = 60;
  private interval?: ReturnType<typeof setInterval>;
  public modal: NgbActiveModal = inject(NgbActiveModal)

  ngOnInit() {
    this.interval = setInterval(() => {
      if (this.secondsLeft > 0) this.secondsLeft--;
      else clearInterval(this.interval);
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
