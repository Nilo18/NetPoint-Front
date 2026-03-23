import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();

  email = '';

  subscribe() {
    if (this.email) {
      console.log('Subscribed:', this.email);
      this.email = '';
    }
  }
}
