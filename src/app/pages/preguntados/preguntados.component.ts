import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { PreguntadosService } from '../../services/preguntados.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

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

  categoriaSeleccionada = signal<number | null>(null);
  dificultadSeleccionada = signal<string>('easy');

  @ViewChild('opcionesContainer') opcionesContainer?: ElementRef<HTMLUListElement>;

  ngOnInit() {
    this.preguntadosService.obtenerCategorias().subscribe(res => {
      this.categorias.set(res.trivia_categories);
      this.renderizarCategorias();
    });
  }

  renderizarCategorias() {
    const select = document.querySelector('select');
    if (!select || this.categorias().length === 0) return;

    // Limpiar
    select.innerHTML = '<option value="">-- Categoría --</option>';

    for (const cat of this.categorias()) {
      const option = document.createElement('option');
      option.value = String(cat.id);
      option.textContent = cat.name;
      select.appendChild(option);
    }
  }

  iniciarJuego() {
    if (!this.categoriaSeleccionada()) {
      Swal.fire('Elegí una categoría', '', 'warning');
      return;
    }

    this.preguntadosService
      .obtenerPreguntas(this.categoriaSeleccionada()!, this.dificultadSeleccionada())
      .subscribe(res => {
        this.preguntas.set(res.results);
        this.indice.set(0);
        this.puntaje.set(0);
        this.juegoIniciado.set(true);
        this.cargarPregunta();
      });
  }

  cargarPregunta() {
    const pregunta = this.preguntas()[this.indice()];
    const opciones = [...pregunta.incorrect_answers, pregunta.correct_answer];
    this.opciones.set(this.mezclar(opciones));
    this.preguntaActual.set(pregunta);

    setTimeout(() => this.renderizarOpciones(), 0);
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
        html: `Tu puntaje final es: <strong>${this.puntaje()}</strong>`,
        icon: 'success',
        confirmButtonText: 'Jugar otra vez'
      }).then(() => {
        this.juegoIniciado.set(false);
        this.preguntas.set([]);
        this.preguntaActual.set(null);
        this.opciones.set([]);
      });
    }
  }

  renderizarOpciones() {
    const ul = this.opcionesContainer?.nativeElement;
    if (!ul) return;

    ul.innerHTML = ''; // Limpiar

    for (const opcion of this.opciones()) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
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
