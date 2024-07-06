import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamService } from '../../../services/team/team.service';
import { TeamResponse } from '../../types/team-response';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ClubService } from '../../../services/club/club.service';
import { ClubResponse } from '../../types/club-response';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-team-dashboard',
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
    TeamService,
    ClubService
  ],
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss']
})
export class TeamDashboardComponent implements OnInit {

  ownerId: string = '';
  clubId: string = '';
  teams: TeamResponse[] = [];
  clubs: ClubResponse[] = [];
  selectedClubId: string = '';
  selectedTeam: TeamResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute, 
    private teamService: TeamService,
    private clubService: ClubService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.clubId = this.route.snapshot.params['club_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.clubs = data;
        this.clubId ? this.selectedClubId = this.clubId : this.selectedClubId = this.clubs[0].id;
        this.loadTeams(this.selectedClubId);
      },
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  loadTeams(clubId: string): void {
    this.teamService.getTeamsByClubId(clubId).subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error('Error loading teams', err)
    });
  }

  onClubChange(event: any): void {
    this.teams = [];
    this.selectedClubId = event.target.value;
    this.loadTeams(this.selectedClubId);
  }

  onCreateTeam(): void {
      this.router.navigate(['/dashboard', this.ownerId, 'teams', 'create-team', this.selectedClubId]);
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

  onDeleteTeam(): void {
    if (this.selectedTeam)
      this.teamService.deleteTeam(this.selectedTeam.id).subscribe({
        next: () => {
          this.teams = this.teams.filter(team => team.id !== this.selectedTeam!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting team', err)
      });
  }

  onEditTeam(teamId: string): void {
    this.router.navigate(['/dashboard', this.ownerId, 'teams', 'edit-team', teamId]);
  }

  onCreateClub(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'clubs', 'create-club']);
  }
}
