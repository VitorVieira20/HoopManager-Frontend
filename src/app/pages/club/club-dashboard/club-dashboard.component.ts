import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubService } from '../../../services/club/club.service';
import { ClubResponse } from '../../types/club-response';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule, 
    FontAwesomeModule
  ],
  providers: [
    ClubService
  ],
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.scss']
})
export class ClubDashboardComponent implements OnInit {

  ownerId: string = '';
  clubs: ClubResponse[] = [];
  clubToDelete: ClubResponse | null = null;
  modalRef?: NgbModalRef;
  faEdit = faEdit;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => this.clubs = data,
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  onCreateClub(): void {
    this.router.navigate(['/dashboard', this.ownerId, 'clubs', 'create-club']);
  }

  openDeleteModal(content: TemplateRef<any>, club: ClubResponse): void {
    this.clubToDelete = club;
    this.modalRef = this.modalService.open(content);
  }

  declineDelete(): void {
    this.modalRef?.close();
  }

  confirmDelete(): void {
    this.modalRef?.close();
    this.onDeleteClub();
  }

  onEditClub(clubId: string): void {
    this.router.navigate(['/dashboard', this.ownerId, 'clubs', 'edit-club', clubId], { queryParams: { returnUrl: 'club-dashboard' } });
  }
  

  onDeleteClub() : void {
    if (this.clubToDelete) {
      this.clubService.deleteClub(this.clubToDelete.id).subscribe({
        next: () => {
          this.clubs = this.clubs.filter(club => club.id !== this.clubToDelete!.id);
          this.modalRef?.close();
        },
        error: (err) => console.error('Error deleting club', err)
      });
    }
  }
}