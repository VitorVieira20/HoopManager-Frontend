import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ClubResponse } from '../types/club-response';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FontAwesomeModule
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
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService, 
    private location: Location, 
    private router: Router
  ) { }

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

  onEditClub(): void {
    this.router.navigate(['/club/edit-club', this.clubId])
  }

  goBack(): void {
    this.location.back();
  }

}
