import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../../pages/types/login-response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private httpClient: HttpClient) { }

  apiUrl: string = "http://localhost:8081/api/auth";

  signup(name: string, email: string, password: string, role: string, plan: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, password, role, plan })
  }
}
