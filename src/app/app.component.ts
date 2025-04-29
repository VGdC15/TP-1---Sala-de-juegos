import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' 
})
export class AppComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isLoggedIn = this.auth.isLoggedIn;
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
