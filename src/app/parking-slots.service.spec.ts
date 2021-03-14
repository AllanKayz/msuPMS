import { TestBed } from '@angular/core/testing';

import { ParkingSlotsService } from './parking-slots.service';

describe('ParkingSlotsService', () => {
  let service: ParkingSlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingSlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
