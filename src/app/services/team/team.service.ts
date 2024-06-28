import { HttpClient } from '@angular/common/http';
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

  getTeamsByClubId(clubId: string) {
    return this.httpClient.get<TeamResponse[]>(this.apiUrl + "club/" + clubId)
  }

  getTeamById(teamId: string) {
    return this.httpClient.get<TeamResponse>(this.apiUrl + teamId)
  }

  getAllTeamsByOwnerId(ownerId: string) {
    return this.httpClient.get<TeamResponse[]>(this.apiUrl + "all/" + ownerId)
  }

  createTeam(teamRequest: TeamRequest) {
    return this.httpClient.post<TeamRequest>(this.apiUrl, teamRequest);
  }

  updateTeam(teamId: string, teamUpdateRequest: TeamUpdateRequest) {
    return this.httpClient.put<TeamRequest>(`${this.apiUrl}${teamId}`, teamUpdateRequest);
  }

  deleteTeam(teamId: string) {
    return this.httpClient.delete(`${this.apiUrl}${teamId}`);
  }
}
