import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from '../../../services/game/game.service';
import { GameResponse } from '../../types/game-response';
import { GameUpdateRequest } from '../../types/game-update-request';

interface EditGameForm {
  home_team: FormControl<string | null>
  away_team: FormControl<string | null>
  home_score: FormControl<number | null>
  away_score: FormControl<number | null>
  location: FormControl<string | null>
  date: FormControl<string | null>
}


@Component({
  selector: 'app-games-edit',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    GameService
  ],
  templateUrl: './games-edit.component.html',
  styleUrl: './games-edit.component.scss'
})
export class GamesEditComponent implements OnInit{

  editGameForm!: FormGroup<EditGameForm>

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private gameService: GameService,
    private modalService: NgbModal
  ) {
    this.editGameForm = new FormGroup<EditGameForm>({
      home_team: new FormControl('', [Validators.required, Validators.minLength(3)]),
      away_team: new FormControl('', [Validators.required, Validators.minLength(3)]),
      home_score: new FormControl(null),
      away_score: new FormControl(null),
      location: new FormControl(''),
      date: new FormControl('', [Validators.required]),
    });
  }

  ownerId: string = '';
  gameId: string = '';
  game: GameResponse | null = null;
  modalRef?: NgbModalRef;

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.gameId = this.route.snapshot.params['game_id'];
    this.loadGameInfo();
  }

  loadGameInfo(): void {
    this.gameService.getGameById(this.gameId).subscribe({
      next: (data) => {
        this.game = data;
        this.editGameForm.patchValue({
          home_team: this.game.home_team,
          away_team: this.game.away_team,
          home_score: this.game.home_score,
          away_score: this.game.away_score,
          location: this.game.location,
          date: this.formatDateForForm(this.game.date)   
        });
      },
      error: (err) => console.error('Error loading player info', err)
    });
  }

  openConfirmationModal(content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content);
  }

  confirmUpdate(): void {
    this.modalRef?.close();
    this.onEditGame();
  }

  declineUpdate(): void {
    this.modalRef?.close();
  }

  onEditGame(): void {
    if (this.editGameForm.valid) {
      const gameUpdateRequest: GameUpdateRequest = {
        home_team: this.editGameForm.value.home_team || '',
        away_team: this.editGameForm.value.away_team || '',
        home_score: this.editGameForm.value.home_score || null,
        away_score: this.editGameForm.value.away_score || null,
        location: this.editGameForm.value.location || '',
        date: this.editGameForm.value.date || '',
      };

      this.gameService.updateGame(this.gameId, gameUpdateRequest).subscribe({
        next: () => { this.router.navigate(['/dashboard', this.ownerId, 'games', this.game?.team_id]) },
        error: (err) => console.error('Error updating game', err)
      });
    }
  }

  formatDateForForm(date: string | Date): string {
    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
