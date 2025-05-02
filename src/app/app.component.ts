import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
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
  isLogin = computed(() => this.currentUrl() === '/login');
  isRegistro = computed(() => this.currentUrl() === '/registro');

  // actualiza signal cuando cambia la URL
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(this.router.url);
      }
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

  menuAbierto: boolean = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
  

}
