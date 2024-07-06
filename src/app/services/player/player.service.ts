import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerResponse } from '../../pages/types/player-response';
import { PlayerRequest } from '../../pages/types/player-request';
import { PlayerUpdateRequest } from '../../pages/types/player-update-request';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/player/";

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  getPlayersByOwnerId(ownerId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "owner/" + ownerId, { headers: this.getAuthHeaders() })
  }

  getPlayersByTeamId(teamId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "team/" + teamId, { headers: this.getAuthHeaders() })
  }

  getPlayersByGameId(gameId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "game/" + gameId, { headers: this.getAuthHeaders() })
  }

  getRemainingPlayersFromGameInfoByGameId(gameId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "gameInfo/" + gameId, { headers: this.getAuthHeaders() })
  }

  getPlayerById(playerId: string) {
    return this.httpClient.get<PlayerResponse>(this.apiUrl + playerId, { headers: this.getAuthHeaders() })
  }

  createPlayer(playerRequest: PlayerRequest) {
    return this.httpClient.post<PlayerRequest>(this.apiUrl, playerRequest, { headers: this.getAuthHeaders() });
  }

  updatePlayer(playerId: string, playerUpdateRequest: PlayerUpdateRequest) {
    return this.httpClient.put<PlayerRequest>(`${this.apiUrl}${playerId}`, playerUpdateRequest, { headers: this.getAuthHeaders() });
  }

  deletePlayer(playerId: string) {
    return this.httpClient.delete(`${this.apiUrl}${playerId}`, { headers: this.getAuthHeaders() });
  }
}
