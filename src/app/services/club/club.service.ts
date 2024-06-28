import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClubRequest } from '../../pages/types/club-request';
import { ClubUpdateRequest } from '../../pages/types/club-update-request';
import { ClubResponse } from '../../pages/types/club-response';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/club/";

  getClubsByOwnerId(owenerId: string){
    return this.httpClient.get<ClubResponse[]>(this.apiUrl + "owner/" + owenerId)
  }

  getClubById(clubId: string){
    return this.httpClient.get<ClubResponse>(this.apiUrl + clubId)
  }

  getClubByTeamId(teamId: string) {
    return this.httpClient.get<ClubResponse>(this.apiUrl + "team/" + teamId)
  }

  createClub(clubRequest: ClubRequest) {
    return this.httpClient.post<ClubRequest>(this.apiUrl, clubRequest);
  }

  updateClub(clubId: string, clubUpdateRequest: ClubUpdateRequest) {
    return this.httpClient.put<ClubRequest>(`${this.apiUrl}${clubId}`, clubUpdateRequest);
  }

  deleteClub(clubId: string) {
    return this.httpClient.delete(`${this.apiUrl}${clubId}`);
  }
}
