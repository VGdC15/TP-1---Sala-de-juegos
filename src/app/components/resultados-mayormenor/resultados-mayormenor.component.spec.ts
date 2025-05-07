import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosMayormenorComponent } from './resultados-mayormenor.component';

describe('ResultadosMayormenorComponent', () => {
  let component: ResultadosMayormenorComponent;
  let fixture: ComponentFixture<ResultadosMayormenorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosMayormenorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosMayormenorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
