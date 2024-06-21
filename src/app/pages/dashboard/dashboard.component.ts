import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ClubResponse } from '../types/club-response';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    DashboardService
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  ownerId: string = '';
  clubs: ClubResponse[] = [];

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private router: Router) { }

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.params['owner_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.dashboardService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => this.clubs = data,
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  onCreateClub(): void {
    this.router.navigate(['/club/create-club', this.ownerId]);
  }

}