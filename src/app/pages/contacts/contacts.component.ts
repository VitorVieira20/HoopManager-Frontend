import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubResponse } from '../types/club-response';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { ClubService } from '../../services/club/club.service';

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
    ClubService
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  ownerId: string = '';
  clubId: string = '';
  club!: ClubResponse;
  clubs: ClubResponse[] = []
  faEdit = faEdit;
  selectedClubId: string = '';

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private location: Location, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.clubId = this.route.snapshot.params['club_id'];
    if (this.clubId) {
      this.loadClubInfo(this.clubId);
    } else {
      this.loadClubs();
    }
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.clubs = data;
        if (this.clubs.length === 1) {
          this.club = this.clubs[0];
        } else {
          this.selectedClubId = this.clubs[0]?.id || '';
          this.loadClubInfo(this.selectedClubId);
        }
      },
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  loadClubInfo(clubId: string): void {
    this.clubService.getClubById(clubId).subscribe({
      next: (data) => this.club = data,
      error: (err) => console.error('Error loading club info', err)
    });
  }

  onEditClub(): void {
    this.router.navigate(['/club/edit-club', this.club.id]);
  }

  goBack(): void {
    this.location.back();
  }

  onClubChange(event: any): void {
    const selectedClubId = event.target.value;
    this.loadClubInfo(selectedClubId);
  }
}
