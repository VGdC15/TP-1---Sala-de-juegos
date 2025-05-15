import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaConTiempoComponent } from './tabla-con-tiempo.component';

describe('TablaConTiempoComponent', () => {
  let component: TablaConTiempoComponent;
  let fixture: ComponentFixture<TablaConTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaConTiempoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaConTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
