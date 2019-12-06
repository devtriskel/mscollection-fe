import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Styles } from '../../models/style/styles.model';
import { StyleRQ } from 'src/app/models/style/style-rq.model';
import { StyleRS } from 'src/app/models/style/style-rs.model';
import { Artists } from 'src/app/models/artist/artists.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StyleApiService {

  constructor(private http: HttpClient) { }

  getAllStyles() {
    return this.http.get<Styles>(environment.apiStyles)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  getRelatedArtists(id: number) {
    let endpoint = (id == null) ?
      environment.apiArtists : environment.apiStylesRelatedArtists.replace('{styleId}', id.toString());
    
    return this.http.get<Artists>(endpoint)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  saveStyle(styleRq: StyleRQ): any {
    if (styleRq.id == null) {
      return this.saveNewStyle(styleRq);
    } else {
      return this.updateStyle(styleRq);
    }
  }

  private saveNewStyle(styleRq: StyleRQ) {
    return this.http.post<StyleRS>(environment.apiStyles, styleRq, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  private updateStyle(styleRq: StyleRQ) {
    return this.http.put(environment.apiStyles + '/' + styleRq.id, styleRq, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  deleteStyle(id: number) {
    return this.http.delete(environment.apiStyles + '/' + id, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError('An error has occurred');
  }

}
