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

  ownerId: string = '';
  user!: UserResponse;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.params['owner_id'];
    this.loadUserInfo();
  }

  loadUserInfo() : void {
    this.dashboardService.getUserById(this.ownerId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Error loading user', err)
    })
  }

  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('user-email');
    sessionStorage.removeItem('user-id');
    this.router.navigate(['/login']);
  }

}
