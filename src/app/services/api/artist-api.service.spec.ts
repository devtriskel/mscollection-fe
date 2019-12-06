import { TestBed } from '@angular/core/testing';

import { ArtistApiService } from './artist-api.service';

describe('ArtistApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtistApiService = TestBed.get(ArtistApiService);
    expect(service).toBeTruthy();
  });
});
