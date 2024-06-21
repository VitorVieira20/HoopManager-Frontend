import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ClubResponse } from '../types/club-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    DashboardService
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

  clubId: string = '';
  club!: ClubResponse;

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.clubId = this.route.snapshot.params['club_id'];
    this.loadClubInfo();
  }

  loadClubInfo(): void {
    this.dashboardService.getClubById(this.clubId).subscribe({
      next: (data) => this.club = data,
      error: (err) => console.error('Error loading clubs', err)
    });
  }

}
