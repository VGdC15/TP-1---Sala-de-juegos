import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../clase/usuario';
import { FormValidaBorra } from '../../clase/form-valida-borra';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit{
  //injectar servicio
  auth = inject(AuthService)

  //inyectar db
  db = inject(DatabaseService);
  router = inject(Router);
  changeDetector = inject(ChangeDetectorRef);

  errorRegistro: string = '';
  seIntentoGuardar: boolean = false;


  agregarUsuarioDb(usuario : Usuario){
    this.db.crearUsuario(usuario);
  }

  //Forms
  formulario?: FormGroup;
 
  ngOnInit(){
    this.formulario = new FormGroup({
      email: new FormControl("", {validators: [Validators.minLength(3), Validators.required ]}),
      nombre: new FormControl("", {validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required ]}),
      apellido: new FormControl("", {validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required ]}),
      edad: new FormControl("", {validators: [Validators.min(0), Validators.max(70), Validators.required ]}),
      password: new FormControl("", {validators: [Validators.minLength(6), Validators.maxLength(15), Validators.required ]}),

    })
  }
  async guardarUsuario() {
    this.seIntentoGuardar = true;

    if (!this.formulario?.valid) return;
    const {email, nombre, apellido, edad, password} = this.formulario.value;

    const usuario = new Usuario(

      email,
      nombre,
      apellido,
      edad,
    );

    this.errorRegistro = '';

    try {
      const respuesta = await this.auth.guardarUsuarioAuth(email, password, nombre, apellido, edad);
      this.agregarUsuarioDb(usuario);
      this.borrarForm();
      this.router.navigate(['/juegos']);
    } catch (error: any) {
      if (error.message?.includes("User already registered") || error.code === '23505') {
        this.errorRegistro = 'El usuario ya se encuentra registrado.';
      } else {
        this.errorRegistro = 'Error al registrar usuario: ' + error.message;
      }
      this.changeDetector.detectChanges();
    }
  
  }

  getErrorMensaje(campo: string, tipo: string) {
    return FormValidaBorra.getErrorMensaje(this.formulario, campo, tipo);
  }
  
  borrarForm() {
    this.seIntentoGuardar = false;
    FormValidaBorra.borrarFormulario(this.formulario);
  }

  get email() { return this.formulario?.get('email'); }
  get nombre() { return this.formulario?.get('nombre'); }
  get apellido() { return this.formulario?.get('apellido'); }
  get edad() { return this.formulario?.get('edad'); }
  get password() { return this.formulario?.get('password'); }


}