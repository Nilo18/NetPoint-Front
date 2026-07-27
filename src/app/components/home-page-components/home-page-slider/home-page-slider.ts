import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface SliderCard {
  profile: string;
  name: string;
  position: string;
  description: string;
}

@Component({
  selector: 'app-home-page-slider',
  imports: [NgOptimizedImage],
  templateUrl: './home-page-slider.html',
  styleUrl: './home-page-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'pauseSlider()',
    '(mouseleave)': 'resumeSlider()',
    '(focusin)': 'pauseSlider()',
    '(focusout)': 'resumeSlider()',
  },
})
export class HomePageSlider {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cardsPerPage = 3;
  private autoPlayTimer: ReturnType<typeof setInterval> | undefined;

  readonly sliderCards: SliderCard[] = [
    {
      profile: 'assets/prof_icon1.jpg',
      name: 'Sarah Martinez',
      position: 'Owner, The Corner Store',
      description:
        '"NetPoint transformed how we manage inventory. The custom schema feature means we can track exactly what matters to our business."',
    },
    {
      profile: 'assets/prof_icon2.jpg',
      name: 'James Chen',
      position: 'CFO, Urban Retail Group',
      description:
        '"The profit tracking is incredible. We now see our margins in real-time and can make informed decisions on the spot."',
    },
    {
      profile: 'assets/prof_icon3.jpg',
      name: 'Emily Johnson',
      position: 'Manager, Boutique Fashion',
      description:
        '"Our cashiers love the interface. Checkout times dropped by 40% since switching to NetPoint. Best investment we made."',
    },
    {
      profile: 'assets/prof_icon4.jpg',
      name: 'Michael Rodriguez',
      position: 'Director, Tech Solutions Inc',
      description:
        '"Finally, a POS that adapts to us instead of forcing us to adapt to it. The custom fields are a game-changer."',
    },
    {
      profile: 'assets/prof_icon5.jpg',
      name: 'David Kim',
      position: 'Founder, Kimchi Groceries',
      description:
        '"The multi-register sync works flawlessly. Our front counter and back warehouse stay perfectly coordinated without any lag."',
    },
    {
      profile: 'assets/prof_icon6.jpg',
      name: 'Lisa Vane',
      position: 'Operations Specialist, Aura Salon',
      description:
        '"Appointment booking integrations saved us hours of administrative work each week. Clients love the seamless experience."',
    },
    {
      profile: 'assets/prof_icon7.jpg',
      name: 'Marcus Thorne',
      position: 'General Manager, Peak Coffee Co.',
      description:
        '"Offline mode rescued us during a major internet outage. We processed transactions without missing a single sale or customer."',
    },
    {
      profile: 'assets/prof_icon8.jpg',
      name: 'Elena Rostova',
      position: 'Owner, Bloom & Petal Florist',
      description:
        '"Vendor management tools are incredibly intuitive. Reordering seasonal inventory now takes minutes instead of an entire afternoon."',
    },
    {
      profile: 'assets/prof_icon9.jpg',
      name: 'Brian Gallagher',
      position: 'VP of Tech, Horizon Hospitality',
      description:
        '"The API documentation made custom integrations straightforward. We hooked it up to our proprietary accounting software in days."',
    },
    {
      profile: 'assets/prof_icon10.jpg',
      name: 'Chloe Sinclair',
      position: 'Creative Director, Studio Design Market',
      description:
        '"Gift card tracking and loyalty program support brought back repeat customers. It paid for itself within the first two months."',
    },
    {
      profile: 'assets/prof_icon11.jpg',
      name: 'Arjun Mehta',
      position: 'Managing Partner, Spice Route Eats',
      description:
        '"Table-side ordering capabilities sped up our evening dinner rushes. Table turnover is much faster and errors dropped to zero."',
    },
    {
      profile: 'assets/prof_icon12.jpg',
      name: 'Rachel Green',
      position: 'Logistics Head, Central Perk Supply',
      description:
        '"Tax reporting summaries make tax season completely stress-free. Every breakdown we need is exported with just a single click."',
    },
  ];

  readonly activePage = signal(0);
  readonly pages = Array.from(
    { length: Math.ceil(this.sliderCards.length / this.cardsPerPage) },
    (_, index) => index,
  );
  readonly visibleCards = computed(() => {
    const start = this.activePage() * this.cardsPerPage;
    return this.sliderCards.slice(start, start + this.cardsPerPage);
  });

  constructor() {
    this.startAutoPlay();
    this.destroyRef.onDestroy(() => this.stopAutoPlay());
  }

  selectPage(page: number): void {
    this.activePage.set(page);
    this.restartAutoPlay();
  }

  pauseSlider(): void {
    this.stopAutoPlay();
  }

  resumeSlider(): void {
    this.startAutoPlay();
  }

  private startAutoPlay(): void {
    if (this.autoPlayTimer) {
      return;
    }

    this.autoPlayTimer = setInterval(() => {
      this.activePage.update((page) => (page + 1) % this.pages.length);
    }, 2000);
  }

  private stopAutoPlay(): void {
    clearInterval(this.autoPlayTimer);
    this.autoPlayTimer = undefined;
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
