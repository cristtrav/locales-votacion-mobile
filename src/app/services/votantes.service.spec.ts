import { TestBed } from '@angular/core/testing';

import { VotantesService } from './votantes.service';

describe('VotantesService', () => {
  let service: VotantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
