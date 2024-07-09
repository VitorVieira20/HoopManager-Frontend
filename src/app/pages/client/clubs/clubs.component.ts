import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubService } from '../../../services/club/club.service';
import { ClubResponse } from '../../types/club-response';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { UserUpdateRequest } from '../../types/user-update-request';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { UserResponse } from '../../types/user-response';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
  ],
  providers: [
    ClubService,
    UserService,
    DashboardService
  ],
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss']
})
export class ClubsComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  userId: string = ''
  clubId: string = ''
  club: ClubResponse = {id: '', name: '', email: '', phone: 0, instagram: '', twitter: '', facebook: '', owner_id: ''}
  clubsSearch: ClubResponse[] = []
  favoriteClubs: ClubResponse[] = []
  user: UserResponse = {id: '', name: '', email: '', role: '', plan: '', clubs: [''], teams: [''], games: [''], players: ['']}
  showAddConfirmationModal: boolean = false;
  showRemoveConfirmationModal: boolean = false;
  clubToRemove: string | null = null;
  clubToAdd: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.parent?.snapshot.params['user_id']
    this.clubId = this.route.snapshot.params['club_id']
    if (this.clubId) {
      this.loadClubInfo(this.clubId)
    }
    this.loadFavoriteClubs()
  }

  loadClubInfo(clubId: string): void {
    this.clubService.getClubById(clubId).subscribe({
      next: (data) => this.club = data,
      error: (err) => console.log('Error while loading club information: ', err)
    });
  }

  loadClubs(event: Event): void {
    const input = event.target as HTMLInputElement
    const clubName = input.value
    if (clubName === '') {
      this.clubsSearch = []
    } else {
      this.clubService.getClubsByName(clubName).subscribe({
        next: (data) => {
          if (data) {
            this.clubsSearch = data.filter(club => !this.favoriteClubs.some(favClub => favClub.id === club.id))
          } else {
            this.clubsSearch = []
          }
          console.log('Updated clubsSearch:', this.clubsSearch);
        },
        error: (err) => console.log('Error while searching for clubs:', err)
      })
    }    
  }

  loadFavoriteClubs(): void {
    this.clubService.getFavoriteClubsByUserId(this.userId).subscribe({
      next: (data) => this.favoriteClubs = data,
      error: (err) => console.log('Error while loading favorite clubs: ', err)
    });
  }

  showRemoveFavoriteModal(clubId: string): void {
    this.showRemoveConfirmationModal = true;
    this.clubToRemove = clubId;
  }

  showAddFavoriteModal(clubId: string): void {
    this.showAddConfirmationModal = true;
    this.clubToAdd = clubId;
  }

  confirmRemoveFavorite(): void {
    if (this.clubToRemove) {
      const updatedFavoritesIds = this.favoriteClubs.filter(club => club.id !== this.clubToRemove).map(club => club.id)

      const updateUserRequest: UserUpdateRequest = { clubs: updatedFavoritesIds }

      this.userService.updateUser(this.userId, updateUserRequest).subscribe({
        next: (data) => {
          this.user = data;
          this.favoriteClubs = this.favoriteClubs.filter(club => club.id !== this.clubToRemove);
          this.showRemoveConfirmationModal = false;
          this.clubToRemove = null;
          this.router.navigate([this.router.url]).then(() => {
            this.searchInput.nativeElement.value = '';
            this.clubsSearch = []
          });
        },
        error: (err) => console.log('Error while updating user information: ', err)
      });
    }
  }

  confirmAddFavorite(): void {
    if (this.clubToAdd) {
      const updatedFavoritesIds = [...this.favoriteClubs.map(club => club.id), this.clubToAdd];

      const updateUserRequest: UserUpdateRequest = { clubs: updatedFavoritesIds };

      this.userService.updateUser(this.userId, updateUserRequest).subscribe({
        next: (data) => {
          this.user = data;
          this.favoriteClubs.push(this.clubsSearch.find(club => club.id === this.clubToAdd)!);
          this.showAddConfirmationModal = false;
          this.clubToAdd = null;
          this.router.navigate([this.router.url]).then(() => {
            this.searchInput.nativeElement.value = '';
            this.clubsSearch = []
          });
        },
        error: (err) => console.log('Error while updating user information: ', err)
      });
    }
  }
  
  cancelRemoveFavorite(): void {
    this.showRemoveConfirmationModal = false;
    this.clubToRemove = null;
  }

  cancelAddFavorite(): void {
    this.showAddConfirmationModal = false;
    this.clubToAdd = null;
  }
}
