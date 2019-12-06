import { TestBed } from '@angular/core/testing';

import { MemberApiService } from './member-api.service';

describe('MemberApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MemberApiService = TestBed.get(MemberApiService);
    expect(service).toBeTruthy();
  });
});
