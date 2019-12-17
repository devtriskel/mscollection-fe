import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Members } from '../../models/member/members.model';
import { MemberRQ } from 'src/app/models/member/member-rq.model';
import { MemberRS } from 'src/app/models/member/member-rs.model';
import { Artist } from 'src/app/models/artist/artist.model';

const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
const httpOptionsUri = {headers: new HttpHeaders({ 'Content-Type': 'text/uri-list' })};

@Injectable({
  providedIn: 'root'
})
export class MemberApiService {

  constructor(private http: HttpClient) { }

  getAllMembers() {
    return this.http.get<Members>(environment.apiMembers)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  getRelatedArtist(memberId: number) {
    return this.http.get<Artist>(environment.apiMembersToArtist.replace('{memberId}', memberId.toString())
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  saveMember(memberRq: MemberRQ): any {
    if (memberRq.id == null) {
      return this.saveNewMember(memberRq);
    } else {
      return this.updateMember(memberRq);
    }
  }

  private saveNewMember(memberRq: MemberRQ) {
    return this.http.post<MemberRS>(environment.apiMembers, memberRq, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  private updateMember(memberRq: MemberRQ) {
    return this.http.patch(environment.apiMembers + '/' + memberRq.id, memberRq, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  deleteMember(id: number) {
    return this.http.delete(environment.apiMembers + '/' + id, httpOptions)
      .pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  // Add new associations
  addRelatedArtist(memberId: number, artistId: number) {
    return this.http.put(
        environment.apiMembersToArtist.replace('{memberId}', memberId.toString()),
        environment.apiArtists + "/" + artistId.toString(),
        httpOptionsUri
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  // Delete associations
  deleteRelatedArtist(memberId: number) {
    return this.http.delete(environment.apiMembersToArtist.replace('{memberId}', memberId.toString())
      ).pipe(
        timeout(environment.timeout),
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError('An error has occurred');
  }

}
