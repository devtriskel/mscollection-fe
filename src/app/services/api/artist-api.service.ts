import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Artists } from '../../models/artist/artists.model';
import { ArtistRQ } from 'src/app/models/artist/artist-rq.model';
import { ArtistRS } from 'src/app/models/artist/artist-rs.model';
import { Members } from 'src/app/models/member/members.model';
import { Styles } from 'src/app/models/style/styles.model';

const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
const httpOptionsUri = {headers: new HttpHeaders({ 'Content-Type': 'text/uri-list' })};

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

  // Create and update
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

  // Get related fields
  getRelatedMembers(id: number) {
    return this.http.get<Members>(environment.apiArtistsRelatedMembers.replace('{artistId}', id.toString()))
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  getRelatedStyles(id: number) {
    return this.http.get<Styles>(environment.apiArtistsRelatedStyles.replace('{artistId}', id.toString()))
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  getRelatedArtists(id: number) {
    return this.http.get<Artists>(environment.apiArtistsRelatedArtists.replace('{artistId}', id.toString()))
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  // Add new associations
  addRelatedStyle(artistId: number, styleId: number) {
    return this.http.patch(
        environment.apiArtistsRelatedStyles.replace('{artistId}', artistId.toString()),
        environment.apiStyles + "/" + styleId,
        httpOptionsUri
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  addRelatedArtist(artistId: number, relatedToArtistsId: number) {
    return this.http.patch(
        environment.apiArtistsRelatedArtists.replace('{artistId}', artistId.toString()),
        environment.apiArtists + "/" + relatedToArtistsId,
        httpOptionsUri
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  // Delete associations
  deleteRelatedStyle(artistId: number, styleId: number) {
    return this.http.delete(environment.apiArtistsDeleteRelatedStyle
        .replace('{artistId}', artistId.toString())
        .replace('{styleId}', styleId.toString())
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  deleteRelatedArtist(artistId: number, relatedToArtistsId: number) {
    return this.http.delete(environment.apiArtistsDeleteRelatedArtist
        .replace('{artistId}', artistId.toString())
        .replace('{relatedToArtistsId}', relatedToArtistsId.toString())
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError('An error has occurred');
  }

}
