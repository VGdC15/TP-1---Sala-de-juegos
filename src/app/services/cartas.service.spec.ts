import { TestBed } from '@angular/core/testing';

import { CartasService } from './cartas.service';

describe('CartasService', () => {
  let service: CartasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
