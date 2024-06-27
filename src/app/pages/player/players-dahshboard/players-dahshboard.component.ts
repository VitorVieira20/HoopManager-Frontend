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

@Component({
  selector: 'app-players-dahshboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule
  ],

  providers: [
    PlayerService
  ],
  templateUrl: './players-dahshboard.component.html',
  styleUrl: './players-dahshboard.component.scss'
})
export class PlayersDahshboardComponent implements OnInit {

  teamId: string = '';
  players: PlayerResponse[] = [];
  selectedPlayer: PlayerResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private playerService : PlayerService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['team_id'];
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayersByTeamId(this.teamId).subscribe({
      next: (data) => this.players = data,
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  onCreatePlayer(): void {
    this.router.navigate(['/players/create-players', this.teamId]);
  }

  openDeleteModal(content: TemplateRef<any>, team: PlayerResponse): void {
    this.selectedPlayer = team;
    this.modalRef = this.modalService.open(content);
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  confirmDelete(): void {
    this.modalRef?.close();
    this.onDeleteTeam();
  }

  onDeleteTeam() : void {
    /*if (this.selectedTeam)
      this.teamService.deleteTeam(this.selectedTeam.id).subscribe({
        next: () => {
          this.teams = this.teams.filter(team => team.id !== this.selectedTeam!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting club', err)
      });*/
  }

  onEditPlayer(playerId: string): void {
    this.router.navigate(['/player/edit-player', playerId])
  }

  goBack(): void {
    this.location.back();
  }
}
