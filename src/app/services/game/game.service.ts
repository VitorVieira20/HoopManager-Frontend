import { HttpClient } from '@angular/common/http';
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

  getGamesByTeamId(teamId: string){
    return this.httpClient.get<GameResponse[]>(this.apiUrl + "team/" + teamId)
  }

  getGameById(gameId: string){
    return this.httpClient.get<GameResponse>(this.apiUrl + gameId)
  }

  createGame(gameRequest: GameRequest) {
    return this.httpClient.post<GameRequest>(this.apiUrl, gameRequest);
  }

  updateGame(gameId: string, gameUpdateRequest: GameUpdateRequest) {
    return this.httpClient.put<GameRequest>(`${this.apiUrl}${gameId}`, gameUpdateRequest);
  }

  deleteGame(gameId: string) {
    return this.httpClient.delete(`${this.apiUrl}${gameId}`);
  }
}
