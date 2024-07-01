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
  selectedClubId: string = '';
  selectedTeamId: string = '';
  selectedGame: GameResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private gameService: GameService,
    private clubService: ClubService,
    private teamService: TeamService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.teamId = this.route.snapshot.params['team_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.clubs = data;
        if (this.teamId) {
          this.setClubAndLoadTeams();
        } else {
          this.selectedClubId = this.clubs[0]?.id;
          this.loadTeams();
        }
      },
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  setClubAndLoadTeams(): void {
    this.teamService.getTeamById(this.teamId).subscribe({
      next: (team) => {
        this.selectedClubId = team.club_id;
        this.loadTeams();
      },
      error: (err) => console.error('Error getting team by ID', err)
    });
  }

  loadTeams(): void {
    this.teamService.getTeamsByClubId(this.selectedClubId).subscribe({
      next: (data) => {
        this.teams = data;
        this.selectedTeamId = this.teamId && this.teams.some(team => team.id === this.teamId) ? this.teamId : this.teams[0]?.id;
        this.loadGames();
      },
      error: (err) => console.error('Error loading teams', err)
    });
  }

  loadGames(): void {
    if (!this.selectedTeamId) {
      this.games = [];
      return;
    }
    this.gameService.getGamesByTeamId(this.selectedTeamId).subscribe({
      next: (data) => this.games = data,
      error: (err) => console.error('Error loading games', err)
    });
  }

  onClubChange(event: any): void {
    this.selectedClubId = event.target.value;
    this.teams = [];
    this.games = [];
    this.teamId = '';
    this.loadTeams();
  }

  onTeamChange(event: any): void {
    this.selectedTeamId = event.target.value;
    this.games = [];
    this.loadGames();
  }

  onCreateGame(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'games', 'create-game', this.selectedTeamId]);
  }

  openDeleteModal(content: TemplateRef<any>, game: GameResponse): void {
    this.selectedGame = game;
    this.modalRef = this.modalService.open(content);
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  confirmDelete(): void {
    this.modalRef?.close();
    this.onDeleteGame();
  }

  onDeleteGame() : void {
    if (this.selectedGame)
      this.gameService.deleteGame(this.selectedGame.id).subscribe({
        next: () => {
          this.games = this.games.filter(game => game.id !== this.selectedGame!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting game', err)
      });
  }

  onEditGame(gameId: string): void {
    this.router.navigate(['/dashboard', this.ownerId, 'games', 'edit-game', gameId])
  }

  hasTeams(): boolean {
    return this.teams.length > 0;
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
}
