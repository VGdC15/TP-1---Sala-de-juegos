import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GithubService } from '../../services/github.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule, FormsModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent {
  auth = inject(AuthService);

  githubService = inject(GithubService);
  usuario = 'VGdC15';

  ngOnInit(): void {
    this.traer(); 
  }

  traer() {
    this.githubService.traerDatos(this.usuario);
  }

  get datos() {
    return this.githubService.datoActual;
  } 
}
  