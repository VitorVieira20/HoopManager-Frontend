import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClubRequest } from '../pages/types/club-request';
import { ClubUpdateRequest } from '../pages/types/club-update-request';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/club/";

  createClub(
    owner_id: string,
    name: string,
    email: string,
    phone: number,
    instagram: string,
    twitter: string,
    facebook: string
  ) {
    return this.httpClient.post<ClubRequest>(this.apiUrl, { owner_id, name, email, phone, instagram, twitter, facebook });
  }

  updateClub(clubId: string, clubUpdateRequest: ClubUpdateRequest) {
    return this.httpClient.put<ClubRequest>(`${this.apiUrl}${clubId}`, clubUpdateRequest);
  }
}
