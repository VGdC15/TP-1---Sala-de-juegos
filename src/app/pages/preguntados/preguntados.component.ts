import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { PreguntadosService } from '../../services/preguntados.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { TraductorService } from '../../services/traductor.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent{
  private preguntadosService = inject(PreguntadosService);

  categorias = signal<{ id: number; name: string }[]>([]);
  preguntas = signal<any[]>([]);
  preguntaActual = signal<any | null>(null);
  indice = signal(0);
  puntaje = signal(0);
  opciones = signal<string[]>([]);
  juegoIniciado = signal(false);
  bloquearOpciones = false;

  categoriaSeleccionada = signal<number | null>(null);
  dificultadSeleccionada = signal<string>('easy');

  //control de tiempo
  tiempo = signal(0);
  timer: any;
  segundosRestantes = signal(60);
  tiempoTotalAcumulado = signal(0);

  //guardado en db
  auth = inject(AuthService);
  supabase = inject(SupabaseService);
  puntajeGuardado = false;

  //traductor
  private traductor = inject(TraductorService);
  preguntaTraducida = signal<string>('');
  opcionesTraducidas = signal<string[]>([]);

  async ngOnInit() {
    Swal.fire({
      title: 'PREGUNTADOS',
      html: `
        <p style="text-align:center; color:#f8f8f2">
          ¿Cómo se juega?<br>
          - Tenés que responder correctamente preguntas de trivia.<br>
          - Cada respuesta correcta suma puntos.<br>
          - Cada error te resta puntos.<br>
          - Cuanto más rápido respondas,<br> ¡más puntaje sumás!<br>
          ¡Elegí una categoría y empezá a jugar!
        </p>
      `,
      icon: 'info',
      confirmButtonText: '¡Entendido!',
      background: '#1e1e2f',
      color: '#f8f8f2',
      confirmButtonColor: 'rgb(200, 27, 253)', 
      iconColor: 'orange',
      width: '420px'
    });
  
    // Traer las categorías
    const res = await firstValueFrom(this.preguntadosService.obtenerCategorias());
    const categoriasOriginales: { id: number; name: string }[] = res.trivia_categories;

  
    // Traducir los nombres al español
    const categoriasTraducidas = await Promise.all(
      categoriasOriginales.map(async cat => {
        const nombreTraducido = await this.traductor.traducir(cat.name);
        return {
          id: cat.id,
          name: nombreTraducido
        };
      })
    );
  
    this.categorias.set(categoriasTraducidas);
    this.renderizarCategorias();
  }

  async renderizarCategorias() {
    const select = document.querySelector('select');
    if (!select || this.categorias().length === 0) return;
  
    // Limpiar
    select.innerHTML = '<option value="">-- Categoría --</option>';
  
    for (const cat of this.categorias()) {
      await Promise.resolve(); 
      const option = document.createElement('option');
      option.value = String(cat.id);
      option.textContent = cat.name;
      select.appendChild(option);
    }
  }
  
  async iniciarJuego() {
    if (!this.categoriaSeleccionada()) {
      Swal.fire({
        title: 'Elegí una categoría',
        html: `
          <p style="text-align:center; color:#f8f8f2">
            Para comenzar, primero tenés que elegir una categoría del menú desplegable.
          </p>
        `,
        icon: 'warning',
        confirmButtonText: 'Ok',
        background: '#1e1e2f',
        color: '#f8f8f2',
        confirmButtonColor: 'rgb(200, 27, 253)',
        iconColor: 'orange',
        width: '420px'
      });
      
      return;
    }

    try {
      const res = await firstValueFrom(
        this.preguntadosService.obtenerPreguntas(
          this.categoriaSeleccionada()!,
          this.dificultadSeleccionada()
        )
      );

      this.preguntas.set(res.results);
      this.indice.set(0);
      this.puntaje.set(0);
      this.juegoIniciado.set(true);

      await this.cargarPregunta();

    } catch (error) {
      console.error('Error al obtener preguntas:', error);
      Swal.fire({
        title: 'Ocurrió un error al cargar las preguntas',
        html: `
          <p style="text-align:center; color:#f8f8f2">
            Por favor, intentá nuevamente.
          </p>
        `,
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#1e1e2f',
        color: '#f8f8f2',
        confirmButtonColor: 'rgb(200, 27, 253)',
        iconColor: 'red',
        width: '420px'
      });
      
    }
  }

  async cargarPregunta() {
    clearInterval(this.timer);
    this.segundosRestantes.set(60);
  
    const pregunta = this.preguntas()[this.indice()];
    const opcionesOriginales = [...pregunta.incorrect_answers, pregunta.correct_answer];
    const opcionesMezcladas = this.mezclar(opcionesOriginales);
  
    this.preguntaActual.set(pregunta);
    this.opciones.set(opcionesMezcladas);
  
    // Traducir pregunta
    const preguntaTraducida = await this.traductor.traducir(pregunta.question);
    this.preguntaTraducida.set(preguntaTraducida);
  
    // Traducir opciones
    const opcionesTraducidas = await Promise.all(opcionesMezcladas.map(op => this.traductor.traducir(op)));
    this.opcionesTraducidas.set(opcionesTraducidas);
  
    this.iniciarTemporizador();
  }
  

  responder(opcion: string, indiceBtn: number) {
    this.bloquearOpciones = true;
    clearInterval(this.timer);
    const tiempoUsado = 60 - this.segundosRestantes();
    this.tiempoTotalAcumulado.update(t => t + tiempoUsado);
  
    const correcta = this.preguntaActual()?.correct_answer;
    const botones = [
      document.getElementById('btn0'),
      document.getElementById('btn1'),
      document.getElementById('btn2'),
      document.getElementById('btn3'),
    ];
  
    if (opcion === correcta) {
      this.puntaje.update(p => p + 100);
      botones[indiceBtn]?.classList.add('correcta');
    } else {
      this.puntaje.update(p => p - 5);
      botones[indiceBtn]?.classList.add('incorrecta');
      const indexCorrecta = this.opciones().findIndex(op => op === correcta);
      if (indexCorrecta !== -1) {
        botones[indexCorrecta]?.classList.add('correcta');
      }
    }
  
    setTimeout(() => {
      // Limpiar clases
      botones.forEach(btn => {
        btn?.classList.remove('correcta', 'incorrecta');
      });
  
      this.bloquearOpciones = false;
      this.pasarASiguientePregunta();
    }, 1500); // Espera 1.5 segundos
  }
  
  
  mezclar(array: string[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  iniciarTemporizador() {
    this.timer = setInterval(() => {
      const restante = this.segundosRestantes();
      if (restante > 0) {
        this.segundosRestantes.set(restante - 1);
      } else {
        clearInterval(this.timer);
        this.tiempoTotalAcumulado.update(t => t + 60); // suma 60 si no respondió
        this.pasarASiguientePregunta();
      }
    }, 1000);
  }

  pasarASiguientePregunta() {
    if (this.indice() + 1 < this.preguntas().length) {
      this.indice.update(i => i + 1);
      this.cargarPregunta();
    } else {
      this.terminarJuego();
    }
  }

  terminarJuego() {
    clearInterval(this.timer);
    Swal.fire({
      title: 'Juego terminado',
      html: `
        <p style="text-align:center; color:#f8f8f2">
          Tu puntaje final es: <strong>${this.puntaje()}</strong><br>
          Tiempo total: <strong>${this.tiempoTotalAcumulado()} segundos</strong>
        </p>
      `,
      icon: 'success',
      confirmButtonText: 'Jugar otra vez',
      background: '#1e1e2f',
      color: '#f8f8f2',
      confirmButtonColor: 'rgb(200, 27, 253)',
      iconColor: 'orange',
      width: '420px'
    }).then(() => {
      this.guardarPuntaje();
      this.juegoIniciado.set(false);
      this.preguntas.set([]);
      this.preguntaActual.set(null);
      this.opciones.set([]);
      this.tiempoTotalAcumulado.set(0);
    });
  }
  
    guardarPuntaje() {
      if (this.puntajeGuardado) return;
      const usuario = this.auth.usuario(); 
    
      if (!usuario || !usuario.email) {
        console.error("No hay usuario logueado o falta el email");
        return;
      }
    
      const puntaje = this.puntaje();
      const tiempo = this.tiempoTotalAcumulado().toString();
      const email = usuario.email; 
    
      this.supabase.guardarPuntaje('puntajePreguntados', puntaje, email, tiempo);
      this.puntajeGuardado = true;
  
    }
  
}
