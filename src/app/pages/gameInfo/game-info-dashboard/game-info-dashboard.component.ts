import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
import { GameInfoResponse } from '../../types/gameInfo-response';
import { GameInfoService } from '../../../services/gameInfo/game-info.service';
import { PlayerResponse } from '../../types/player-response';
import { PlayerService } from '../../../services/player/player.service';
import { TeamResponse } from '../../types/team-response';
import { GameResponse } from '../../types/game-response';

@Component({
  selector: 'app-game-info-dashboard',
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
    GameService,
    GameInfoService
  ],
  templateUrl: './game-info-dashboard.component.html',
  styleUrl: './game-info-dashboard.component.scss'
})
export class GameInfoDashboardComponent implements OnInit {

  ownerId: string = '';
  gameId: string = '';
  gameInfo: GameInfoResponse[] = [];
  teamPlayers: PlayerResponse[] = [];
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private gameInfoService: GameInfoService,
    private gameService: GameService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.gameId = this.route.snapshot.params['game_id'];
    this.loadGameInfos(); 
  }

  loadGameInfos(): void {
    this.gameInfoService.getGameInfoByGameId(this.gameId).subscribe({
      next: (data) => this.gameInfo = data,
      error: (err) => console.error('Error loading game info', err)
    });
  }

  onEditPlayerInfo(infoId: number): void {
    
  }

  onAddInfo(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'gamesInfo', 'create-info', this.gameId]);
  }

  goBack(): void {
    this.gameService.getGameById(this.gameId).subscribe({
      next: (data) => this.router.navigate(['/dashboard', this.ownerId, 'games', data.team_id]),
      error: (err) => console.error('Error loading game', err)
    })    
  }

}
