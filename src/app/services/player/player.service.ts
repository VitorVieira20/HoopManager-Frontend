import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerResponse } from '../../pages/types/player-response';
import { PlayerRequest } from '../../pages/types/player-request';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/player/";

  getPlayersByTeamId(teamId: string){
    return this.httpClient.get<PlayerResponse[]>(this.apiUrl + "team/" + teamId)
  }

  createPlayer(playerRequest: PlayerRequest) {
    return this.httpClient.post<PlayerRequest>(this.apiUrl, playerRequest);
  }
}
