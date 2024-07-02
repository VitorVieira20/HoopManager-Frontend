import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameInfoResponse } from '../../pages/types/gameInfo-response';
import { GameInfoRequest } from '../../pages/types/gameInfo-request';


@Injectable({
  providedIn: 'root'
})
export class GameInfoService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/gameInfo/";

  getGameInfoByGameId(gameId: string){
    return this.httpClient.get<GameInfoResponse[]>(this.apiUrl + "game/" + gameId)
  }

  createGameInfo(gameInfoRequest: GameInfoRequest) {
    return this.httpClient.post<GameInfoRequest>(this.apiUrl, gameInfoRequest);
  }

}
