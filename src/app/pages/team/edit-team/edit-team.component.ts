import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../../services/team/team.service';
import { TeamUpdateRequest } from '../../types/team-update-request';
import { TeamResponse } from '../../types/team-response';

interface EditTeamForm {
  name: FormControl<string | null>
}

@Component({
  selector: 'app-edit-team',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    TeamService
  ],
  templateUrl: './edit-team.component.html',
  styleUrl: './edit-team.component.scss'
})
export class EditTeamComponent implements OnInit {

  editTeamForm!: FormGroup<EditTeamForm>

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private teamService: TeamService,
    private modalService: NgbModal
  ) {
    this.editTeamForm = new FormGroup<EditTeamForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ownerId: string = '';
  teamId: string = '';
  team: TeamResponse | null = null;
  modalRef?: NgbModalRef;

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.teamId = this.route.snapshot.params['team_id'];
    this.loadTeamInfo();
  }

  loadTeamInfo(): void {
    this.teamService.getTeamById(this.teamId).subscribe({
      next: (data) => {
        this.team = data;
        this.editTeamForm.patchValue({
          name: this.team.name,
        });
      },
      error: (err) => console.error('Error loading club info', err)
    });
  }

  openConfirmationModal(content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content);
  }

  confirmUpdate(): void {
    this.modalRef?.close();
    this.onEditTeam();
  }

  declineUpdate(): void {
    this.modalRef?.close();
  }

  onEditTeam(): void {
    if (this.editTeamForm.valid) {
      const teamUpdateRequest: TeamUpdateRequest = {
        name: this.editTeamForm.value.name || '',
      };

      this.teamService.updateTeam(this.teamId, teamUpdateRequest).subscribe({
        next: () => { this.router.navigate(['/dashboard', this.ownerId, 'teams', this.team?.club_id]) },
        error: (err) => console.error('Error updating club', err)
      });
    }
  }

}
