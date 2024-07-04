import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResponse } from '../../pages/types/user-response';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/user/";

  getUserById(ownerId: string) {
    const authToken = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return this.httpClient.get<UserResponse>(this.apiUrl + ownerId, { headers });
  }

}
