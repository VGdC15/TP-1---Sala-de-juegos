import { Component, OnInit, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormValidaBorra } from '../../clase/form-valida-borra';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    //inyectar db
    db = inject(DatabaseService);

    auth = inject(AuthService);


    formulario!: FormGroup;

    ngOnInit() {
      this.formulario = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      });
    }

    getErrorMensaje(campo: string, tipo: string) {
      return FormValidaBorra.getErrorMensaje(this.formulario, campo, tipo);
    }
    
    borrarForm() {
      FormValidaBorra.borrarFormulario(this.formulario);
    }

    constructor(private router: Router) {}
    async login() {
      const { email, password } = this.formulario.value;
    
      try {
        await this.auth.login(email, password);
        this.router.navigate(['/home']);
      } catch (error) {
        alert('Error de login: Usuario o contraseña incorrectos.');
      }
    }
    
}
