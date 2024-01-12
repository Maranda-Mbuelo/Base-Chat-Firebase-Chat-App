import { TestBed } from '@angular/core/testing';

import { TypewritterService } from './typewritter.service';

describe('TypewritterService', () => {
  let service: TypewritterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypewritterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
