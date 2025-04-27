import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoPropioComponent } from './juego-propio.component';

describe('JuegoPropioComponent', () => {
  let component: JuegoPropioComponent;
  let fixture: ComponentFixture<JuegoPropioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuegoPropioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JuegoPropioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
