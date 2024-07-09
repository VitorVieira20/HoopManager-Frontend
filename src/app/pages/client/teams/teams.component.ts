import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../types/user-response';
import { TeamResponse } from '../../types/team-response';
import { TeamService } from '../../../services/team/team.service';
import { UserService } from '../../../services/user/user.service';
import { UserUpdateRequest } from '../../types/user-update-request';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    TeamService,
    UserService
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  userId: string = '';
  teamId: string = '';
  team: TeamResponse = {id: '', name: '', club_id: ''};
  teamsSearch: TeamResponse[] = [];
  favoriteTeams: TeamResponse[] = [];
  filteredFavoriteTeams: TeamResponse[] = [];
  user: UserResponse = {id: '', name: '', email: '', role: '', plan: '', clubs: [''], teams: [''], games: [''], players: ['']};
  showAddConfirmationModal: boolean = false;
  showRemoveConfirmationModal: boolean = false;
  teamToRemove: string | null = null;
  teamToAdd: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.parent?.snapshot.params['user_id'];
    this.teamId = this.route.snapshot.params['team_id'];
    if (this.teamId) {
      this.loadTeamInfo(this.teamId);
    }
    this.loadFavoriteTeams();
  }

  loadTeamInfo(teamId: string) {
    this.teamService.getTeamById(teamId).subscribe({
      next: (data) => this.team = data,
      error: (err) => console.log('Error while loading team information: ', err)
    });
    console.log("Data: ", this.team)
  }

  private filterFavoriteTeams(teams: TeamResponse[]): TeamResponse[] {
    const favoriteTeamsIds = new Set(this.favoriteTeams.map(team => team.id));
    return teams.filter(team => !favoriteTeamsIds.has(team.id));
  }

  loadTeams(event: Event): void {
    const input = event.target as HTMLInputElement;
    const teamName = input.value;

    if (teamName === '') {
      this.teamsSearch = [];
    } else {
      this.teamService.getTeamsByName(teamName).subscribe({
        next: (data) => {
          if (data) {
            this.teamsSearch = this.filterFavoriteTeams(data);
          } else {
            this.teamsSearch = [];
          }
        },
        error: (err) => console.log('Error while searching for clubs:', err)
      });
    }
  }

  loadFavoriteTeams(): void {
    this.teamService.getFavoriteTeamsByUserId(this.userId).subscribe({
      next: (data) => {
        if (data) {
          this.favoriteTeams = data;
          this.filteredFavoriteTeams = this.teamId ? data.filter(team => team.id !== this.teamId) : data;
        } else {
          console.log('No favorite clubs data received.');
        }
      },
      error: (err) => {
        console.log('Error while loading favorite clubs:', err);
        this.favoriteTeams = [];
        this.filteredFavoriteTeams = [];
      }
    });
  }

  showRemoveFavoriteModal(teamId: string): void {
    this.showRemoveConfirmationModal = true;
    this.teamToRemove = teamId;
  }

  showAddFavoriteModal(teamId: string): void {
    this.showAddConfirmationModal = true;
    this.teamToAdd = teamId;
  }

  confirmRemoveFavorite(): void {
    if (this.teamToRemove) {
      const updatedFavoritesIds = this.favoriteTeams.filter(team => team.id !== this.teamToRemove).map(team => team.id);

      const updateUserRequest: UserUpdateRequest = { teams: updatedFavoritesIds };

      this.userService.updateUser(this.userId, updateUserRequest).subscribe({
        next: (data) => {
          this.user = data;
          this.favoriteTeams = this.favoriteTeams.filter(team => team.id !== this.teamToRemove);
          this.showRemoveConfirmationModal = false;
          this.teamToRemove = null;
          this.router.navigate([this.router.url]).then(() => {
            this.searchInput.nativeElement.value = '';
            this.loadFavoriteTeams()
            this.teamsSearch = [];
          });
        },
        error: (err) => console.log('Error while updating user information:', err)
      });
    }
  }

  confirmAddFavorite(): void {
    if (this.teamToAdd) {
      const updatedFavoritesIds = [...this.favoriteTeams.map(team => team.id), this.teamToAdd];

      const updateUserRequest: UserUpdateRequest = { teams: updatedFavoritesIds };

      this.userService.updateUser(this.userId, updateUserRequest).subscribe({
        next: (data) => {
          this.user = data;
          this.favoriteTeams.push(this.teamsSearch.find(team => team.id === this.teamToAdd)!);
          this.showAddConfirmationModal = false;
          this.teamToAdd = null;
          this.router.navigate([this.router.url]).then(() => {
            this.searchInput.nativeElement.value = '';
            this.loadFavoriteTeams()
            this.teamsSearch = [];
          });
        },
        error: (err) => console.log('Error while updating user information:', err)
      });
    }
  }

  cancelRemoveFavorite(): void {
    this.showRemoveConfirmationModal = false;
    this.teamToRemove = null;
  }

  cancelAddFavorite(): void {
    this.showAddConfirmationModal = false;
    this.teamToAdd = null;
  }

}
