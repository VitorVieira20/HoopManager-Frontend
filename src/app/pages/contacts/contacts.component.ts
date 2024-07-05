import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubResponse } from '../types/club-response';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ClubService } from '../../services/club/club.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.clubId = this.route.snapshot.params['club_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.clubs = data;
        if (this.clubId) {
          this.selectedClubId = this.clubId
          this.loadClubInfo(this.selectedClubId);
        } else {
          if (this.clubs.length === 1) {
            this.club = this.clubs[0];
          } else {
            this.selectedClubId = this.clubs[0]?.id || '';
            this.loadClubInfo(this.selectedClubId);
          }
        }
      },
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  loadClubInfo(clubId: string): void {
    this.clubService.getClubById(clubId).subscribe({
      next: (data) => {
        this.club = data;
        console.log(this.club)
      },
      error: (err) => console.error('Error loading club info', err)
    });
  }

  onEditClub(clubId: string): void {
    this.router.navigate(['/dashboard', this.ownerId, 'clubs', 'edit-club', clubId], { queryParams: { returnUrl: 'contacts' } });
  }  

  onClubChange(event: any): void {
    const selectedClubId = event.target.value;
    this.loadClubInfo(selectedClubId);
  }

  onCreateClub(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'clubs', 'create-club']);
  }
}
