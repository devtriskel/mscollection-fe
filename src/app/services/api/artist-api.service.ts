import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Artists } from '../../models/artist/artists.model';
import { ArtistRQ } from 'src/app/models/artist/artist-rq.model';
import { ArtistRS } from 'src/app/models/artist/artist-rs.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ArtistApiService {

  constructor(private http: HttpClient) { }

  getAllArtists() {
    return this.http.get<Artists>(environment.apiArtists)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  saveArtist(artistRq: ArtistRQ): any {
    if (artistRq.id == null) {
      return this.saveNewArtist(artistRq);
    } else {
      return this.updateArtist(artistRq);
    }
  }

  private saveNewArtist(artistRq: ArtistRQ) {
    return this.http.post<ArtistRS>(environment.apiArtists, artistRq, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  private updateArtist(artistRq: ArtistRQ) {
    return this.http.put(environment.apiArtists + '/' + artistRq.id, artistRq, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  deleteArtist(id: number) {
    return this.http.delete(environment.apiArtists + '/' + id, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError('An error has occurred');
  }

}
