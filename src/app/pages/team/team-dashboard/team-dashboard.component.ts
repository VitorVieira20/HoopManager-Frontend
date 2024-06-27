import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../../services/team/team.service';
import { TeamResponse } from '../../types/team-response';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-team-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule
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
  selectedTeam: TeamResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private teamService : TeamService,
    private router: Router,
    private location: Location,
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

  openDeleteModal(content: TemplateRef<any>, team: TeamResponse): void {
    this.selectedTeam = team;
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
    if (this.selectedTeam)
      this.teamService.deleteTeam(this.selectedTeam.id).subscribe({
        next: () => {
          this.teams = this.teams.filter(team => team.id !== this.selectedTeam!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting club', err)
      });
  }

  onEditTeam(teamId: string): void {
    this.router.navigate(['/team/edit-team', teamId])
  }

  goBack(): void {
    this.location.back();
  }

}
