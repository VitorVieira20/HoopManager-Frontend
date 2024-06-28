import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../../services/team/team.service';
import { TeamRequest } from '../../types/team-request';

interface CreateTeamForm {
  name: FormControl<string | null>
}

@Component({
  selector: 'app-create-team',
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
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss'
})
export class CreateTeamComponent implements OnInit {

  createTeamForm!: FormGroup<CreateTeamForm>

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private teamService: TeamService,
    private modalService: NgbModal
  ) {
    this.createTeamForm = new FormGroup<CreateTeamForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ownerId: string = '';
  clubId: string = '';
  modalRef?: NgbModalRef;

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.clubId = this.route.snapshot.params['club_id'];
  }

  openConfirmationModal(content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content);
  }

  confirmCreation(): void {
    this.modalRef?.close();
    this.onAddTeam();
  }

  declineCreation(): void {
    this.modalRef?.close();
  }

  onAddTeam(): void {
    if (this.createTeamForm.valid) {
      const teamRequest: TeamRequest = {
        club_id: this.clubId,
        name: this.createTeamForm.value.name!,
      };

      this.teamService.createTeam(teamRequest).subscribe({
        next: () => this.router.navigate(['/dashboard', this.ownerId, 'teams', this.clubId]),
        error: (err) => console.error('Error creating club', err)
      });
    }
  }
}
