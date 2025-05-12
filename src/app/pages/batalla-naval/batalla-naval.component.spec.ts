import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatallaNavalComponent } from './batalla-naval.component';

describe('BatallaNavalComponent', () => {
  let component: BatallaNavalComponent;
  let fixture: ComponentFixture<BatallaNavalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatallaNavalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatallaNavalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
