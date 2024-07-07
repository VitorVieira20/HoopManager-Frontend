import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../../services/game/game.service';
import { CommonModule } from '@angular/common';
import { GameResponse } from '../../types/game-response';
import { TeamService } from '../../../services/team/team.service';
import { ClubService } from '../../../services/club/club.service';
import { ClubResponse } from '../../types/club-response';
import { TeamResponse } from '../../types/team-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    ClubService,
    TeamService,
    GameService
  ],
  templateUrl: './calendar-dashboard.component.html',
  styleUrl: './calendar-dashboard.component.scss'
})
export class CalendarDashboardComponent implements OnInit {

  ownerId: string = '';
  teamId: string = '';
  selectedClubId: string = '';
  selectedTeamId: string = '';
  clubs: ClubResponse[] = [];
  teams: TeamResponse[] = [];
  games: GameResponse[] = [];
  filteredPastGames: GameResponse[] = [];
  filteredFutureGames: GameResponse[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubService,
    private teamService: TeamService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.parent?.params['owner_id']
    this.teamId = this.route.snapshot.params['team_id']
    this.loadClubs()
    this.loadGames()
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.clubs = data;
        if (this.clubs.length > 0) {
          this.selectedClubId = this.clubs[0].id;
          this.loadTeams();
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadTeams(): void {
    this.teamService.getTeamsByClubId(this.selectedClubId).subscribe({
      next: (data) => {
        this.teams = data;
        if (this.teams.length > 0) {
          this.selectedTeamId = this.teams[0].id;
          this.filterGames();
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadGames(): void {
    this.gameService.getGamesByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.games = data;
        this.filterGames();
      },
      error: (err) => console.error(err)
    });
  }

  filterGames(): void {
    const currentDate = new Date();
    this.filteredPastGames = this.games.filter(game => new Date(game.date) < currentDate);
    this.filteredFutureGames = this.games.filter(game => new Date(game.date) >= currentDate);
  }

  onClubChange(event: Event): void {
    this.loadTeams();
  }

  onTeamChange(event: Event): void {
    this.filterGames();
  }

  onCreateGame(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'createGame']);
  }

  onCreateClub(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'clubs', 'create-club']);
  }

  formatDate(date: string | Date): string {
    const dt = new Date(date);
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  }

  hasGameHappened(date: string): boolean {
    return new Date(date) < new Date();
  }

}