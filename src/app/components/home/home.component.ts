import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  router = inject(Router);

  // inicia url actual
  currentUrl = signal(this.router.url);

  isHome = computed(() => this.currentUrl() === '/home');

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

}
 