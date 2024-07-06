import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameResponse } from '../../pages/types/game-response';
import { GameRequest } from '../../pages/types/game-request';
import { GameUpdateRequest } from '../../pages/types/game-update-request';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/game/";

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  getGamesByOwnerId(ownerId: string){
    return this.httpClient.get<GameResponse[]>(this.apiUrl + "owner/" + ownerId, { headers: this.getAuthHeaders() })
  }

  getGamesByTeamId(teamId: string){
    return this.httpClient.get<GameResponse[]>(this.apiUrl + "team/" + teamId, { headers: this.getAuthHeaders() })
  }

  getGameById(gameId: string){
    return this.httpClient.get<GameResponse>(this.apiUrl + gameId, { headers: this.getAuthHeaders() })
  }

  createGame(gameRequest: GameRequest) {
    return this.httpClient.post<GameRequest>(this.apiUrl, gameRequest, { headers: this.getAuthHeaders() });
  }

  updateGame(gameId: string, gameUpdateRequest: GameUpdateRequest) {
    return this.httpClient.put<GameRequest>(`${this.apiUrl}${gameId}`, gameUpdateRequest, { headers: this.getAuthHeaders() });
  }

  deleteGame(gameId: string) {
    return this.httpClient.delete(`${this.apiUrl}${gameId}`, { headers: this.getAuthHeaders() });
  }
}
