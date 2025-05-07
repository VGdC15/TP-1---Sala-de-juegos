import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosAhorcadoComponent } from './resultados-ahorcado.component';

describe('ResultadosAhorcadoComponent', () => {
  let component: ResultadosAhorcadoComponent;
  let fixture: ComponentFixture<ResultadosAhorcadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosAhorcadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosAhorcadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
