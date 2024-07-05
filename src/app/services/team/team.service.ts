import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamResponse } from '../../pages/types/team-response';
import { TeamRequest } from '../../pages/types/team-request';
import { TeamUpdateRequest } from '../../pages/types/team-update-request';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/team/";

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  getTeamsByClubId(clubId: string) {
    return this.httpClient.get<TeamResponse[]>(this.apiUrl + "club/" + clubId, { headers: this.getAuthHeaders() })
  }

  getTeamById(teamId: string) {
    return this.httpClient.get<TeamResponse>(this.apiUrl + teamId, { headers: this.getAuthHeaders() })
  }

  getAllTeamsByOwnerId(ownerId: string) {
    return this.httpClient.get<TeamResponse[]>(this.apiUrl + "all/" + ownerId, { headers: this.getAuthHeaders() })
  }

  createTeam(teamRequest: TeamRequest) {
    return this.httpClient.post<TeamRequest>(this.apiUrl, teamRequest, { headers: this.getAuthHeaders() });
  }

  updateTeam(teamId: string, teamUpdateRequest: TeamUpdateRequest) {
    return this.httpClient.put<TeamRequest>(`${this.apiUrl}${teamId}`, teamUpdateRequest, { headers: this.getAuthHeaders() });
  }

  deleteTeam(teamId: string) {
    return this.httpClient.delete(`${this.apiUrl}${teamId}`, { headers: this.getAuthHeaders() });
  }
}
