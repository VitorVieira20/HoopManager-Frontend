import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/auth/login.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (data) => {
        if (data.role === 'admin') {
          this.router.navigate(['/dashboard', sessionStorage.getItem('user-id'), 'home'])
        } else {
          this.router.navigate(['/client-dashboard', sessionStorage.getItem('user-id'), 'home'])
        }
      },
      error: () => {
        this.errorMessage = "Wrong Credentials";
        return;
      }
    })
  }
}
