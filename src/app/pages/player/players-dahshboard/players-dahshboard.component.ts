import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from '../../../services/player/player.service';
import { PlayerResponse } from '../../types/player-response';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ClubService } from '../../../services/club/club.service';
import { TeamService } from '../../../services/team/team.service';
import { ClubResponse } from '../../types/club-response';
import { TeamResponse } from '../../types/team-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players-dahshboard',
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
    PlayerService,
    ClubService,
    TeamService
  ],
  templateUrl: './players-dahshboard.component.html',
  styleUrls: ['./players-dahshboard.component.scss']
})
export class PlayersDahshboardComponent implements OnInit {

  ownerId: string = '';
  clubId: string = '';
  teamId: string = '';
  clubs: ClubResponse[] = [];
  teams: TeamResponse[] = [];
  players: PlayerResponse[] = [];
  selectedClubId: string = '';
  selectedTeamId: string = '';
  selectedPlayer: PlayerResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private playerService: PlayerService,
    private clubService: ClubService,
    private teamService: TeamService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.clubId = this.route.snapshot.params['club_id'];
    this.teamId = this.route.snapshot.params['team_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.clubs = data;
        this.selectedClubId = this.clubId ? this.clubId : this.clubs[0]?.id;
        this.loadTeams();
      },
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  loadTeams(): void {
    this.teamService.getTeamsByClubId(this.selectedClubId).subscribe({
      next: (data) => {
        this.teams = data;
        this.selectedTeamId = this.teamId ? this.teamId : this.teams[0]?.id;
        this.loadPlayers();
      },
      error: (err) => console.error('Error loading teams', err)
    });
  }

  loadPlayers(): void {
    if (!this.selectedTeamId) {
      this.players = [];
      return;
    }
    this.playerService.getPlayersByTeamId(this.selectedTeamId).subscribe({
      next: (data) => this.players = data,
      error: (err) => console.error('Error loading players', err)
    });
  }

  onClubChange(event: any): void {
    this.selectedClubId = event.target.value;
    this.teams = [];
    this.players = [];
    this.loadTeams();
  }

  onTeamChange(event: any): void {
    this.selectedTeamId = event.target.value;
    this.players = [];
    this.loadPlayers();
  }

  onCreatePlayer(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'players', 'create-player', this.selectedTeamId]);
  }

  openDeleteModal(content: TemplateRef<any>, player: PlayerResponse): void {
    this.selectedPlayer = player;
    this.modalRef = this.modalService.open(content);
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  confirmDelete(): void {
    this.modalRef?.close();
    this.onDeletePlayer();
  }

  onDeletePlayer() : void {
    /*if (this.selectedPlayer)
      this.playerService.deletePlayer(this.selectedPlayer.id).subscribe({
        next: () => {
          this.players = this.players.filter(player => player.id !== this.selectedPlayer!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting player', err)
      });*/
  }

  onEditPlayer(playerId: string): void {
    this.router.navigate(['/dashboard', this.ownerId, 'players', 'edit-player', playerId])
  }

  goBack(): void {
    this.location.back();
  }

  hasTeams(): boolean {
    return this.teams.length > 0;
  }

  onCreateTeam(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'teams', 'create-team', this.selectedClubId]);
  }
}