import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosBatallanavalComponent } from './resultados-batallanaval.component';

describe('ResultadosBatallanavalComponent', () => {
  let component: ResultadosBatallanavalComponent;
  let fixture: ComponentFixture<ResultadosBatallanavalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosBatallanavalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosBatallanavalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
