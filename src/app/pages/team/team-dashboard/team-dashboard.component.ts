import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../../services/team.service';
import { TeamResponse } from '../../types/team-response';

@Component({
  selector: 'app-team-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule
  ],
  providers: [
    TeamService
  ],
  templateUrl: './team-dashboard.component.html',
  styleUrl: './team-dashboard.component.scss'
})
export class TeamDashboardComponent implements OnInit {

  clubId: string = '';
  teams: TeamResponse[] = [];
  teamToDelete: TeamResponse | null = null;
  modalRef?: NgbModalRef;

  constructor(
    private route: ActivatedRoute, 
    private teamService : TeamService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.clubId = this.route.snapshot.params['club_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.teamService.getTeamsByClubId(this.clubId).subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  onCreateTeam(): void {
    this.router.navigate(['/team/create-team', this.clubId]);
  }

  openDeleteModal(content: TemplateRef<any>, club: TeamResponse): void {
    this.teamToDelete = club;
    this.modalRef = this.modalService.open(content);
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  confirmDelete(): void {
    this.modalRef?.close();
    this.onDeleteTeam();
  }

  onDeleteTeam() : void {
    if (this.teamToDelete) {
      this.teamService.deleteTeam(this.teamToDelete.id).subscribe({
        next: () => {
          this.teams = this.teams.filter(team => team.id !== this.teamToDelete!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting club', err)
      });
    }
  }

}
