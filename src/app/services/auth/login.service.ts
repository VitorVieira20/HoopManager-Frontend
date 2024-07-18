import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../pages/types/login-response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/auth";

  login(email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token)
        sessionStorage.setItem('user-id', value.id)
        sessionStorage.setItem('user-role', value.role)
        sessionStorage.setItem('user-plan', value.plan)
      })
    )
  }
  
}
