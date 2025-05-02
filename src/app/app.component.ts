import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({ 
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' 
})
export class AppComponent {
  router = inject(Router);
  auth = inject(AuthService);

  // inicia url actual
  currentUrl = signal(this.router.url);
  isHome = computed(() => this.currentUrl() === '/home');

  // actualiza signal cuando cambia la URL
  constructor() {
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  isLoggedIn = this.auth.isLoggedIn;

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
