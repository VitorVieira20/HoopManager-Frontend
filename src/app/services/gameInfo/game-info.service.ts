import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameInfoResponse } from '../../pages/types/gameInfo-response';
import { GameInfoRequest } from '../../pages/types/gameInfo-request';
import { GameInfoUpdateRequest } from '../../pages/types/gameInfo-update-request';


@Injectable({
  providedIn: 'root'
})
export class GameInfoService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/gameInfo/";

  getGameInfoByGameId(gameId: string){
    return this.httpClient.get<GameInfoResponse[]>(this.apiUrl + "game/" + gameId)
  }

  getGameInfoById(gameInfoId: string){
    return this.httpClient.get<GameInfoResponse>(this.apiUrl + gameInfoId)
  }

  createGameInfo(gameInfoRequest: GameInfoRequest) {
    return this.httpClient.post<GameInfoRequest>(this.apiUrl, gameInfoRequest);
  }

  updateGameInfo(gameInfoId: string, gameInfoUpdateRequest: GameInfoUpdateRequest) {
    return this.httpClient.put<GameInfoUpdateRequest>(`${this.apiUrl}${gameInfoId}`, gameInfoUpdateRequest);
  }

  deleteGameInfo(gameInfoId: number) {
    return this.httpClient.delete(`${this.apiUrl}${gameInfoId}`);
  }
}
