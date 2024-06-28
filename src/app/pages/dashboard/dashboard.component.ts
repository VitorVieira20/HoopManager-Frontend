import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserResponse } from '../types/user-response';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    DashboardService,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  ownerId: string = '';
  user!: UserResponse;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
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
  
}
