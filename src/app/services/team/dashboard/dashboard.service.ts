import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClubResponse } from '../../../pages/types/club-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/club/";

  getClubsByOwnerId(owenerId: string){
    return this.httpClient.get<ClubResponse[]>(this.apiUrl + "owner/" + owenerId)
  }

  getClubById(clubId: string){
    return this.httpClient.get<ClubResponse>(this.apiUrl + clubId)
  }

}
