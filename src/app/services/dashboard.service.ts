import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClubResponse } from '../pages/types/club-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl: string = "http://localhost:8081/api/club/owner/";

  constructor(private httpClient: HttpClient) { }

  getClubsByOwnerId(owenerId: string){
    return this.httpClient.get<ClubResponse[]>(this.apiUrl + owenerId)
  }

}
