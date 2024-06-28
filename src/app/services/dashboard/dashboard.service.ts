import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResponse } from '../../pages/types/user-response';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/user/";

  getUserById(ownerId: string){
    return this.httpClient.get<UserResponse>(this.apiUrl + ownerId)
  }

}
