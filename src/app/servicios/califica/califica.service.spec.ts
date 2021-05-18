import { TestBed } from '@angular/core/testing';

import { CalificaService } from './califica.service';

describe('CalificaService', () => {
  let service: CalificaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalificaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
