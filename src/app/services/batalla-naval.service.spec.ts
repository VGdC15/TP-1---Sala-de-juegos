import { TestBed } from '@angular/core/testing';

import { BatallaNavalService } from './batalla-naval.service';

describe('BatallaNavalService', () => {
  let service: BatallaNavalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatallaNavalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
