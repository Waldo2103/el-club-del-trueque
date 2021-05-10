import { TestBed } from '@angular/core/testing';

import { TruequeService } from './trueque.service';

describe('TruequeService', () => {
  let service: TruequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
