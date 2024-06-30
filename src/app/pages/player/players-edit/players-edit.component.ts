import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from '../../../services/player/player.service';
import { PlayerResponse } from '../../types/player-response';
import { PlayerUpdateRequest } from '../../types/player-update-request';

interface EditPlayerForm {
  name: FormControl<string | null>
  position: FormControl<string | null>
}

@Component({
  selector: 'app-players-edit',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    PlayerService
  ],
  templateUrl: './players-edit.component.html',
  styleUrl: './players-edit.component.scss'
})
export class PlayersEditComponent implements OnInit {

  editPlayerForm!: FormGroup<EditPlayerForm>

  constructor(
    private route: ActivatedRoute, 
    private playerService: PlayerService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.editPlayerForm = new FormGroup<EditPlayerForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      position: new FormControl('', Validators.required)
    });
  }

  ownerId: string = '';
  playerId: string = '';
  player: PlayerResponse | null = null;
  modalRef?: NgbModalRef;

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.playerId = this.route.snapshot.params['player_id'];
    this.loadPlayerInfo();
  }

  loadPlayerInfo(): void {
    this.playerService.getPlayerById(this.playerId).subscribe({
      next: (data) => {
        this.player = data;
        this.editPlayerForm.patchValue({
          name: this.player.name,
          position: this.player.position,
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
    this.onEditPlayer();
  }

  declineUpdate(): void {
    this.modalRef?.close();
  }

  onEditPlayer(): void {
    if (this.editPlayerForm.valid) {
      const playerUpdateRequest: PlayerUpdateRequest = {
        name: this.editPlayerForm.value.name || '',
        position: this.editPlayerForm.value.position || '',
      };

      this.playerService.updatePlayer(this.playerId, playerUpdateRequest).subscribe({
        next: () => { this.router.navigate(['/dashboard', this.ownerId, 'players', this.player?.team_id]) },
        error: (err) => console.error('Error updating player', err)
      });
    }
  }

}