import { HttpClient } from '@angular/common/http';
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

  getPlayersByTeamId(teamId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "team/" + teamId)
  }

  getPlayersByGameId(gameId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "game/" + gameId)
  }

  getRemainingPlayersFromGameInfoByGameId(gameId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "gameInfo/" + gameId)
  }

  getPlayerById(playerId: string) {
    return this.httpClient.get<PlayerResponse>(this.apiUrl + playerId)
  }

  createPlayer(playerRequest: PlayerRequest) {
    return this.httpClient.post<PlayerRequest>(this.apiUrl, playerRequest);
  }

  updatePlayer(playerId: string, playerUpdateRequest: PlayerUpdateRequest) {
    return this.httpClient.put<PlayerRequest>(`${this.apiUrl}${playerId}`, playerUpdateRequest);
  }

  deletePlayer(playerId: string) {
    return this.httpClient.delete(`${this.apiUrl}${playerId}`);
  }
}
