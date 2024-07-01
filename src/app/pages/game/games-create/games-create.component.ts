import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameService } from '../../../services/game/game.service';
import { GameRequest } from '../../types/game-request';

interface CreateGameForm {
  home_team: FormControl<string | null>
  away_team: FormControl<string | null>
  home_score: FormControl<number | null>
  away_score: FormControl<number | null>
  location: FormControl<string | null>
  date: FormControl<string | null>
}

@Component({
  selector: 'app-games-create',
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
  templateUrl: './games-create.component.html',
  styleUrl: './games-create.component.scss'
})
export class GamesCreateComponent implements OnInit {

  createGameForm!: FormGroup<CreateGameForm>

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private gameService: GameService,
    private modalService: NgbModal
  ) {
    this.createGameForm = new FormGroup<CreateGameForm>({
      home_team: new FormControl('', [Validators.required, Validators.minLength(3)]),
      away_team: new FormControl('', [Validators.required, Validators.minLength(3)]),
      home_score: new FormControl(null),
      away_score: new FormControl(null),
      location: new FormControl(''),
      date: new FormControl('', [Validators.required]),
    });
  }

  ownerId: string = '';
  teamId: string = '';
  modalRef?: NgbModalRef;

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.teamId = this.route.snapshot.params['team_id'];
  }

  openConfirmationModal(content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content);
  }

  confirmCreation(): void {
    this.modalRef?.close();
    this.onAddGame();
  }

  declineCreation(): void {
    this.modalRef?.close();
  }

  onAddGame(): void {
    if (this.createGameForm.valid) {
      const gameRequest: GameRequest = {
        team_id: this.teamId,
        home_team: this.createGameForm.value.home_team!,
        away_team: this.createGameForm.value.away_team!,
        home_score: this.createGameForm.value.home_score!,
        away_score: this.createGameForm.value.away_score!,
        location: this.createGameForm.value.location!,
        date: this.createGameForm.value.date!,
      };

      this.gameService.createGame(gameRequest).subscribe({
        next: () => this.router.navigate(['/dashboard', this.ownerId, 'games', this.teamId]),
        error: (err) => console.error('Error creating game', err)
      });
    }
  }
}
