import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../../services/game/game.service';
import { GameInfoResponse } from '../../types/gameInfo-response';
import { GameInfoService } from '../../../services/gameInfo/game-info.service';
import { PlayerResponse } from '../../types/player-response';
import { GameInfoUpdateRequest } from '../../types/gameInfo-update-request';

interface EditGameInfoForm {
  points: FormControl<number | null>;
  assists: FormControl<number | null>;
  rebounds: FormControl<number | null>;
}

@Component({
  selector: 'app-game-info-edit',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    GameInfoService
  ],
  templateUrl: './game-info-edit.component.html',
  styleUrl: './game-info-edit.component.scss'
})
export class GameInfoEditComponent implements OnInit {

  ownerId: string = ''
  gameInfoId: string = ''
  editGameInfoForm!: FormGroup<EditGameInfoForm>;
  gameInfo: GameInfoResponse | null = null
  modalRef?: NgbModalRef;

  constructor(
    private route: ActivatedRoute, 
    private gameInfoService: GameInfoService,
    private modalService: NgbModal,
    private router: Router) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.gameInfoId = this.route.snapshot.params['game_info_id'];
    this.editGameInfoForm = new FormGroup<EditGameInfoForm>({
      points: new FormControl(null),
      assists: new FormControl(null),
      rebounds: new FormControl(null),
    });

    this.loadGameInfoData()
  }

  loadGameInfoData(): void {
    this.gameInfoService.getGameInfoById(this.gameInfoId).subscribe({
      next: (data) => {
        this.gameInfo = data;
        this.editGameInfoForm.patchValue({
          points: this.gameInfo?.points,
          assists: this.gameInfo?.assists,
          rebounds: this.gameInfo?.rebounds
        })
      },
      error: (err) => console.error('Error loading gameInfo info', err)
    })
  }

  openConfirmationModal(content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content);
  }

  confirmUpdate(): void {
    this.modalRef?.close();
    this.onEditGameInfo();
  }

  declineUpdate(): void {
    this.modalRef?.close();
  }

  onEditGameInfo(): void {
    if (this.editGameInfoForm.valid) {
      const gameInfoUpdateRequest: GameInfoUpdateRequest = {
        points: this.editGameInfoForm.value.points ?? 0,
        assists: this.editGameInfoForm.value.assists ?? 0,
        rebounds: this.editGameInfoForm.value.rebounds ?? 0,
      }

      this.gameInfoService.updateGameInfo(this.gameInfoId, gameInfoUpdateRequest).subscribe({
        next: () => this.router.navigate(['/dashboard', this.ownerId, 'gamesInfo', this.gameInfo?.game_id]),
        error: (err) => console.error('Error updating gameInfo', err)
      })
    }
  }
}
