import { TestBed } from '@angular/core/testing';

import { StyleApiService } from './style-api.service';

describe('StyleApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StyleApiService = TestBed.get(StyleApiService);
    expect(service).toBeTruthy();
  });
});
