import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosPreguntadosComponent } from './resultados-preguntados.component';

describe('ResultadosPreguntadosComponent', () => {
  let component: ResultadosPreguntadosComponent;
  let fixture: ComponentFixture<ResultadosPreguntadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosPreguntadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosPreguntadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
