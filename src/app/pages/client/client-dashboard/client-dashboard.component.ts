import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../types/user-response';
import { ActivatedRoute, Router, RouterEvent, RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    DashboardService
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent implements OnInit {

  userId: string = '';
  user!: UserResponse;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['user_id'];
    this.loadUserInfo();
  }

  loadUserInfo() : void {
    this.dashboardService.getUserById(this.userId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Error loading user', err)
    })
  }

  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-email');
    sessionStorage.removeItem('user-id');
    sessionStorage.removeItem('user-role');
    this.router.navigate(['/login']);
  }

}
