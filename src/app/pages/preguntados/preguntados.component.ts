import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { PreguntadosService } from '../../services/preguntados.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

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
  tiempo = signal(0);
  opciones = signal<string[]>([]);
  juegoIniciado = signal(false);
  

  categoriaSeleccionada = signal<number | null>(null);
  dificultadSeleccionada = signal<string>('easy');

  @ViewChild('opcionesContainer') opcionesContainer?: ElementRef<HTMLUListElement>;

  ngOnInit() {
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

    this.preguntadosService.obtenerCategorias().subscribe(res => {
      this.categorias.set(res.trivia_categories);
      this.renderizarCategorias();
    });
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
      Swal.fire('Ocurrió un error al cargar las preguntas', '', 'error');
    }
  }

  async cargarPregunta() {
    const pregunta = this.preguntas()[this.indice()];
    const opciones = [...pregunta.incorrect_answers, pregunta.correct_answer];
    this.opciones.set(this.mezclar(opciones));
    this.preguntaActual.set(pregunta);

    await new Promise(resolve => setTimeout(resolve, 0));
    this.renderizarOpciones();
  }

  responder(opcion: string) {
    const correcta = this.preguntaActual()?.correct_answer;
    if (opcion === correcta) {
      this.puntaje.update(p => p + 100);
    } else {
      this.puntaje.update(p => p - 5);
    }

    if (this.indice() + 1 < this.preguntas().length) {
      this.indice.update(i => i + 1);
      this.cargarPregunta();
    } else {
      Swal.fire({
        title: 'Juego terminado',
        html: `
          <p style="text-align:center; color:#f8f8f2">
            Tu puntaje final es: <strong>${this.puntaje()}</strong>
            Tiempo: <strong>${this.tiempo()}</strong>
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
        this.juegoIniciado.set(false);
        this.preguntas.set([]);
        this.preguntaActual.set(null);
        this.opciones.set([]);
      });
    }
  }

  async renderizarOpciones() {
    const ul = this.opcionesContainer?.nativeElement;
    if (!ul) return;
  
    ul.innerHTML = ''; // Limpiar
  
    await new Promise(resolve => setTimeout(resolve, 0));
  
    for (const opcion of this.opciones()) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
  
      btn.classList.add('opciones');
      btn.innerHTML = opcion;
      btn.addEventListener('click', () => this.responder(opcion));
  
      li.appendChild(btn);
      ul.appendChild(li);
    }
  }
  
  mezclar(array: string[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
