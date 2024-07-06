import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubService } from '../../../services/club/club.service';
import { TeamService } from '../../../services/team/team.service';
import { PlayerService } from '../../../services/player/player.service';
import { GameService } from '../../../services/game/game.service';
import { ActivatedRoute } from '@angular/router';
import { ClubResponse } from '../../types/club-response';
import { TeamResponse } from '../../types/team-response';
import { GameResponse } from '../../types/game-response';
import { PlayerResponse } from '../../types/player-response';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [ClubService, TeamService, PlayerService, GameService],
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent implements OnInit {

  clubs: ClubResponse[] = [];
  teams: TeamResponse[] = [];
  games: GameResponse[] = [];
  players: PlayerResponse[] = [];

  ownerId: string = '';
  totalClubs: number = 0;
  totalTeams: number = 0;
  totalAthletes: number = 0;
  totalGames: number = 0;

  maxTeams: number = 0;
  maxGames: number = 0;
  maxAthletes: number = 0;
  maxTeamGames: number = 0;
  maxTeamAthletes: number = 0;

  clubWithMoreTeams: string = '';
  clubWithMoreGames: string = '';
  clubWithMoreAthletes: string = '';
  teamWithMoreGames: string = '';
  teamWithMoreAthletes: string = '';
  teamWithMoreGamesClub: string = '';
  teamWithMoreAthletesClub: string = '';

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.parent?.params['owner_id'];
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin([
      this.clubService.getClubsByOwnerId(this.ownerId),
      this.teamService.getAllTeamsByOwnerId(this.ownerId),
      this.gameService.getGamesByOwnerId(this.ownerId),
      this.playerService.getPlayersByOwnerId(this.ownerId)
    ]).subscribe({
      next: ([clubs, teams, games, players]) => {
        this.clubs = clubs;
        this.teams = teams;
        this.games = games;
        this.players = players;
        this.totalClubs = this.clubs.length;
        this.totalTeams = this.teams.length;
        this.totalAthletes = this.players.length;
        this.totalGames = this.games.length;

        this.loadStatistics();
      },
      error: (err) => console.log('Error while loading data: ', err)
    });
  }

  loadStatistics(): void {
    this.loadClubStats();
    this.loadTeamStats();
  }

  loadClubStats(): void {
    const stats = this.clubs.reduce((acc, club) => {
      const teamsCount = this.teams.filter(team => team.club_id === club.id).length;
      const gamesCount = this.games.filter(game => {
        const team = this.teams.find(team => team.id === game.team_id);
        return team && team.club_id === club.id;
      }).length;
      const playersCount = this.players.filter(player => {
        const team = this.teams.find(team => team.id === player.team_id);
        return team && team.club_id === club.id;
      }).length;

      // Club with more Teams
      if (teamsCount > acc.maxTeams) {
        acc.maxTeams = teamsCount;
        acc.clubWithMoreTeams = club.name;
      }

      // Club with more Games
      if (gamesCount > acc.maxGames) {
        acc.maxGames = gamesCount;
        acc.clubWithMoreGames = club.name;
      }

      // Club with more Athletes
      if (playersCount > acc.maxAthletes) {
        acc.maxAthletes = playersCount;
        acc.clubWithMoreAthletes = club.name;
      }

      return acc;
    }, {
      maxTeams: 0,
      maxGames: 0,
      maxAthletes: 0,
      clubWithMoreTeams: '',
      clubWithMoreGames: '',
      clubWithMoreAthletes: ''
    });

    this.clubWithMoreTeams = stats.clubWithMoreTeams;
    this.clubWithMoreGames = stats.clubWithMoreGames;
    this.clubWithMoreAthletes = stats.clubWithMoreAthletes;
    this.maxTeams = stats.maxTeams;
    this.maxGames = stats.maxGames;
    this.maxAthletes = stats.maxAthletes;
  }

  loadTeamStats(): void {
    const teamStats = this.teams.reduce((acc, team) => {
      const teamGamesCount = this.games.filter(game => game.team_id === team.id).length;
      const teamPlayersCount = this.players.filter(player => player.team_id === team.id).length;

      const club = this.clubs.find(club => club.id === team.club_id);
      const clubName = club ? club.name : 'Unknown Club';

      // Team with more Games
      if (teamGamesCount > acc.maxTeamGames) {
        acc.maxTeamGames = teamGamesCount;
        acc.teamWithMoreGames = team.name;
        acc.teamWithMoreGamesClub = clubName;
      }

      // Team with more Athletes
      if (teamPlayersCount > acc.maxTeamAthletes) {
        acc.maxTeamAthletes = teamPlayersCount;
        acc.teamWithMoreAthletes = team.name;
        acc.teamWithMoreAthletesClub = clubName;
      }

      return acc;
    }, {
      maxTeamGames: 0,
      maxTeamAthletes: 0,
      teamWithMoreGames: '',
      teamWithMoreAthletes: '',
      teamWithMoreGamesClub: '',
    teamWithMoreAthletesClub: ''
    });

    this.teamWithMoreGames = teamStats.teamWithMoreGames;
    this.teamWithMoreAthletes = teamStats.teamWithMoreAthletes;
    this.maxTeamGames = teamStats.maxTeamGames;
    this.maxTeamAthletes = teamStats.maxTeamAthletes;
    this.teamWithMoreGamesClub = teamStats.teamWithMoreGamesClub;
    this.teamWithMoreAthletesClub = teamStats.teamWithMoreAthletesClub;
  }
}
