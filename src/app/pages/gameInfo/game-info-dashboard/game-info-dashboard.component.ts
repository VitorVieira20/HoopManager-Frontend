import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
import { GameInfoResponse } from '../../types/gameInfo-response';
import { GameInfoService } from '../../../services/gameInfo/game-info.service';
import { PlayerResponse } from '../../types/player-response';

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
  selectedGameInfo?: GameInfoResponse
  modalRef?: NgbModalRef;

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
    console.log('/dashboard/' + this.ownerId + '/gamesInfo/edit-info/' + infoId)
    this.router.navigate(['/dashboard', this.ownerId, 'gamesInfo', 'edit-info', infoId]);
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

  openDeleteModal(deleteModal: TemplateRef<any>, gameInfo: GameInfoResponse): void {
    this.selectedGameInfo = gameInfo;
    this.modalRef = this.modalService.open(deleteModal);
  }

  confirmDelete(): void {
    if (this.selectedGameInfo) {
      this.gameInfoService.deleteGameInfo(this.selectedGameInfo.id).subscribe(() => {
        this.loadGameInfos();
        this.modalRef?.close();
      });
    }
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  getTotalPoints(): number {
    return this.gameInfo.reduce((total, info) => total + info.points, 0);
  }

  getTotalAssists(): number {
    return this.gameInfo.reduce((total, info) => total + info.assists, 0);
  }

  getTotalRebounds(): number {
    return this.gameInfo.reduce((total, info) => total + info.rebounds, 0);
  }
}
