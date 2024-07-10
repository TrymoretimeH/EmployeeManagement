import { TestBed } from '@angular/core/testing';

import { SalarysService } from './salarys.service';

describe('SalarysService', () => {
  let service: SalarysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
