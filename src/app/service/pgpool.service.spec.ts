import { TestBed } from '@angular/core/testing';

import { PGpoolService } from './pgpool.service';

describe('PGpoolService', () => {
  let service: PGpoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PGpoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
