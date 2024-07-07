import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SignupService } from '../../../services/auth/signup.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    SignupService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'user';
  plan: string = 'standard';
  errorMessage: string = '';

  constructor(private signupService: SignupService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }

    this.signupService.signup(this.username, this.email, this.password, this.role, this.plan).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => console.error("Erro inesperado! Tente novamente mais tarde")
    });
  }

  onRoleChange(event: any) {
    this.role = event.target.value;
  }
}
