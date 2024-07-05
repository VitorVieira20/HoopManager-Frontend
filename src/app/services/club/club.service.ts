import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClubRequest } from '../../pages/types/club-request';
import { ClubUpdateRequest } from '../../pages/types/club-update-request';
import { ClubResponse } from '../../pages/types/club-response';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private apiUrl: string = "http://localhost:8081/api/club/";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  getClubsByOwnerId(ownerId: string) {
    return this.httpClient.get<ClubResponse[]>(`${this.apiUrl}owner/${ownerId}`, { headers: this.getAuthHeaders() });
  }

  getClubById(clubId: string) {
    return this.httpClient.get<ClubResponse>(`${this.apiUrl}${clubId}`, { headers: this.getAuthHeaders() });
  }

  createClub(clubRequest: ClubRequest) {
    return this.httpClient.post<ClubResponse>(this.apiUrl, clubRequest, { headers: this.getAuthHeaders() });
  }

  updateClub(clubId: string, clubUpdateRequest: ClubUpdateRequest) {
    return this.httpClient.put<ClubResponse>(`${this.apiUrl}${clubId}`, clubUpdateRequest, { headers: this.getAuthHeaders() });
  }

  deleteClub(clubId: string) {
    return this.httpClient.delete(`${this.apiUrl}${clubId}`, { headers: this.getAuthHeaders() });
  }
}
