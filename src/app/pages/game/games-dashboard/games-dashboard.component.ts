import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ClubService } from '../../../services/club/club.service';
import { TeamService } from '../../../services/team/team.service';
import { ClubResponse } from '../../types/club-response';
import { TeamResponse } from '../../types/team-response';
import { FormsModule } from '@angular/forms';
import { GameResponse } from '../../types/game-response';
import { GameService } from '../../../services/game/game.service';

@Component({
  selector: 'app-games-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    ClubService,
    TeamService,
    GameService
  ],
  templateUrl: './games-dashboard.component.html',
  styleUrl: './games-dashboard.component.scss'
})
export class GamesDashboardComponent implements OnInit {

  ownerId: string = '';
  clubId: string = '';
  teamId: string = '';
  clubs: ClubResponse[] = [];
  teams: TeamResponse[] = [];
  games: GameResponse[] = [];
  filteredGames: GameResponse[] = [];
  selectedClubId: string = '';
  selectedTeamId: string = '';
  selectedSort: string = 'date-asc';
  locationFilter: string = '';
  nameFilter = '';
  selectedGame: GameResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private gameService: GameService,
    private clubService: ClubService,
    private teamService: TeamService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.teamId = this.route.snapshot.params['team_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe((clubs: ClubResponse[]) => {
      this.clubs = clubs;
      if (this.teamId) {
        this.loadTeamsByTeamId(this.teamId);
      } else if (this.clubs.length > 0) {
        this.selectedClubId = this.clubs[0].id;
        this.loadTeams();
      }
    });
  }

  loadTeams(): void {
    if (this.selectedClubId) {
      this.teamService.getTeamsByClubId(this.selectedClubId).subscribe((teams: TeamResponse[]) => {
        this.teams = teams;
        if (this.teams.length > 0) {
          this.selectedTeamId = this.teams[0].id;
          this.loadGames();
        }
      });
    }
  }

  loadTeamsByTeamId(teamId: string): void {
    this.teamService.getTeamById(teamId).subscribe((team: TeamResponse) => {
      this.selectedClubId = team.club_id;
      this.selectedTeamId = team.id;
      this.loadTeamsForClubAndSelectTeam(this.selectedClubId, teamId);
    });
  }

  loadTeamsForClubAndSelectTeam(clubId: string, teamId: string): void {
    this.teamService.getTeamsByClubId(clubId).subscribe((teams: TeamResponse[]) => {
      this.teams = teams;
      this.selectedTeamId = teamId;
      this.loadGames();
    });
  }

  loadGames(): void {
    if (this.selectedTeamId) {
      this.gameService.getGamesByTeamId(this.selectedTeamId).subscribe((games: GameResponse[]) => {
        this.games = games;
        this.applyFilters();
      });
    }
  }

  onClubChange(event: any): void {
    this.selectedClubId = event.target.value;
    this.teamId = '';
    this.teams = [];
    this.filteredGames = [];
    this.loadTeams();
  }

  onTeamChange(event: any): void {
    this.selectedTeamId = event.target.value;
    this.filteredGames = [];
    this.loadGames();
  }

  onSortChange(event: any): void {
    this.selectedSort = event.target.value;
    this.applyFilters();
  }

  onLocationFilterChange(event: any): void {
    this.locationFilter = event.target.value;
    this.applyFilters();
  }

  onNameFilterChange(event: any) {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredGames = this.games.filter(game => {
      const matchesLocation = game.location.toLowerCase().includes(this.locationFilter.toLowerCase());
      const matchesName = game.home_team.toLowerCase().includes(this.nameFilter.toLowerCase()) || game.away_team.toLowerCase().includes(this.nameFilter.toLowerCase());
      return matchesLocation && matchesName;
    });

    if (this.selectedSort === 'date-asc') {
      this.filteredGames.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      this.filteredGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  onCreateGame(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'games', 'create-game', this.selectedTeamId]);
  }

  onEditGame(gameId: string): void {
    this.router.navigate(['/dashboard', this.ownerId, 'games', 'edit-game', gameId]);
  }

  openDeleteModal(deleteModal: TemplateRef<any>, game: GameResponse): void {
    this.selectedGame = game;
    this.modalRef = this.modalService.open(deleteModal);
  }

  confirmDelete(): void {
    if (this.selectedGame) {
      this.gameService.deleteGame(this.selectedGame.id).subscribe(() => {
        this.loadGames();
        this.modalRef?.close();
      });
    }
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  onCreateTeam(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'teams', 'create-team', this.selectedClubId]);
  }

  formatDate(date: string | Date): string {
    const dt = new Date(date);
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  }

  hasGameHappened(date: string | Date): boolean {
    const gameDate = new Date(date);
    const today = new Date();
    return gameDate < today;
  }

  hasTeams(): boolean {
    return this.teams.length > 0;
  }
}
