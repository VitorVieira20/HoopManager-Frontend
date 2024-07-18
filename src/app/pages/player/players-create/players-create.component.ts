import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from '../../../services/player/player.service';

interface CreatePlayerForm {
  name: FormControl<string | null>,
  position: FormControl<string | null>
}

@Component({
  selector: 'app-players-create',
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
  templateUrl: './players-create.component.html',
  styleUrl: './players-create.component.scss'
})
export class PlayersCreateComponent implements OnInit {

  createPlayerForm!: FormGroup<CreatePlayerForm>

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private playerService: PlayerService,
    private modalService: NgbModal
  ) {
    this.createPlayerForm = new FormGroup<CreatePlayerForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(1)]),
      position: new FormControl('', [Validators.required, Validators.minLength(1)]),
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
    this.onAddPlayer();
  }

  declineCreation(): void {
    this.modalRef?.close();
  }

  onAddPlayer(): void {
    if (this.createPlayerForm.valid) {
      const names = this.createPlayerForm.value.name?.split(',').map(name => name.trim());
      const positions = this.createPlayerForm.value.position?.split(',').map(position => position.trim());

      if (names && positions && names.length === positions.length) {
        const players = names.map((name, index) => ({
          team_id: this.teamId,
          name,
          position: positions[index]
        }));

        players.forEach(player => {
          this.playerService.createPlayer(player).subscribe({
            next: () => this.router.navigate(['/dashboard', this.ownerId, 'players' ,this.teamId]),
            error: (err) => console.error('Error creating club', err)
          });
          
        });
      } else {
        console.error('Names and positions count mismatch or invalid input');
      }
    }
  }

}
