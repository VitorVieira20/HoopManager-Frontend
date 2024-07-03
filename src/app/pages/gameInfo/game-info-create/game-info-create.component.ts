import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
import { GameInfoResponse } from '../../types/gameInfo-response';
import { GameInfoRequest } from '../../types/gameInfo-request';
import { GameInfoService } from '../../../services/gameInfo/game-info.service';
import { PlayerResponse } from '../../types/player-response';
import { PlayerService } from '../../../services/player/player.service';

@Component({
  selector: 'app-game-info-create',
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
    GameService,
    GameInfoService
  ],
  templateUrl: './game-info-create.component.html',
  styleUrl: './game-info-create.component.scss'
})
export class GameInfoCreateComponent implements OnInit {

  ownerId: string = '';
  gameId: string = '';
  gameInfo: GameInfoResponse[] = [];
  players: PlayerResponse[] = [];
  playerStats: { [playerId: string]: { points?: number; assists?: number; rebounds?: number } } = {};

  constructor(
    private route: ActivatedRoute, 
    private gameInfoService: GameInfoService,
    private playerService: PlayerService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.gameId = this.route.snapshot.params['game_id'];
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getRemainingPlayersFromGameInfoByGameId(this.gameId).subscribe({
      next: (data) => this.players = data,
      error: (err) => console.error('Error loading game info', err)
    });
  }

  openConfirmModal(confirmTemplate: any): void {
    this.modalService.open(confirmTemplate, { centered: true });
  }

  confirmCreation(): void {
    this.players.forEach(player => {
      if (player.points || player.assists || player.rebounds) {
        const gameInfoRequest: GameInfoRequest = {
          player_id: player.id,
          points: player.points || 0,
          assists: player.assists || 0,
          rebounds: player.rebounds || 0,
          game_id: this.gameId
        };
        this.gameInfoService.createGameInfo(gameInfoRequest).subscribe({
          next: () => this.router.navigate(['/dashboard', this.ownerId, 'gamesInfo', this.gameId]),
          error: (err) => console.error('Error creating player stats', err)
        });
      }
    });
    this.modalService.dismissAll();
  }

  goBack(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'gamesInfo', this.gameId])
  }
}