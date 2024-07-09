import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClubResponse } from '../../pages/types/club-response';
import { UserUpdateRequest } from '../../pages/types/user-update-request';
import { UserResponse } from '../../pages/types/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = "http://localhost:8081/api/user/";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const authToken = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
  }

  updateUser(userId: string, updateUserRequest: UserUpdateRequest) {
    return this.httpClient.put<UserResponse>(`${this.apiUrl}${userId}`, updateUserRequest, { headers: this.getAuthHeaders() });
  }
}
