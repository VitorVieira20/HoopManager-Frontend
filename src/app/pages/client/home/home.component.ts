import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { ClubService } from '../../../services/club/club.service';
import { TeamService } from '../../../services/team/team.service';
import { GameService } from '../../../services/game/game.service';
import { PlayerService } from '../../../services/player/player.service';
import { ClubResponse } from '../../types/club-response';
import { TeamResponse } from '../../types/team-response';
import { GameResponse } from '../../types/game-response';
import { PlayerResponse } from '../../types/player-response';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    DashboardService,
    ClubService,
    TeamService,
    GameService,
    PlayerService
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId: string = '';
  clubsList: string[] = [];
  teamsList: string[] = [];
  gamesList: string[] = [];
  playersList: string[] = [];
  clubs: ClubResponse[] = [];
  teams: TeamResponse[] = [];
  games: GameResponse[] = [];
  players: PlayerResponse[] = [];
  actionsMenuId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private clubService: ClubService,
    private teamService: TeamService,
    private gameService: GameService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.parent?.params['user_id'] || '';
    this.loadUserInfoAndFavorites();
  }

  loadUserInfo(): Observable<any> {
    return this.dashboardService.getUserById(this.userId);
  }

  loadUserFavorites(clubsList: string[], teamsList: string[], gamesList: string[], playersList: string[]): Observable<any[]> {
    const clubRequests = clubsList ? clubsList.map(id => this.clubService.getClubById(id)) : [];
    const teamRequests = teamsList ? teamsList.map(id => this.teamService.getTeamById(id)) : [];
    const gameRequests = gamesList ? gamesList.map(id => this.gameService.getGameById(id)) : [];
    const playerRequests = playersList ? playersList.map(id => this.playerService.getPlayerById(id)) : [];

    return forkJoin([...clubRequests, ...teamRequests, ...gameRequests, ...playerRequests]);
  }

  loadUserInfoAndFavorites(): void {
    this.loadUserInfo().pipe(
      switchMap(data => {
        console.log('User info loaded:', data);
        
        this.clubsList = data.clubs || [];
        this.teamsList = data.teams || [];
        this.gamesList = data.games || [];
        this.playersList = data.athletes || [];

        return this.loadUserFavorites(this.clubsList, this.teamsList, this.gamesList, this.playersList);
      })
    ).subscribe({
      next: (responses) => {
        console.log('Responses:', responses);

        const clubCount = this.clubsList ? this.clubsList.length : 0;
        const teamCount = this.teamsList ? this.teamsList.length : 0;
        const gameCount = this.gamesList ? this.gamesList.length : 0;

        this.clubs = responses.slice(0, clubCount) as ClubResponse[];
        this.teams = responses.slice(clubCount, clubCount + teamCount) as TeamResponse[];
        this.games = responses.slice(clubCount + teamCount, clubCount + teamCount + gameCount) as GameResponse[];
        this.players = responses.slice(clubCount + teamCount + gameCount) as PlayerResponse[];
      },
      error: (err) => console.log('Error while loading user information and favorites:', err)
    });
}


  showClub(clubId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/client-dashboard', this.userId, 'clubs', clubId])
  }

  showTeam(teamId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/client-dashboard', this.userId, 'teams', teamId])
  }

  showPlayer(playerId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/client-dashboard', this.userId, 'players', playerId])
  }
}
