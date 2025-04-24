import { Component, OnInit, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormValidaBorra } from '../../clase/form-valida-borra';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    //inyectar db
    db = inject(DatabaseService);


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
  
    
      //login con Supabase Auth
      const { data, error } = await this.db.supabase.auth.signInWithPassword({
        email,
        password: password
      });
    
      if (error) {
        alert('Error de login: Contraseña incorrecta.');
        return;
      }
    
      //redirige al home
      this.router.navigate(['/home']);
    }
    

}
