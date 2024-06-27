import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ClubResponse } from '../types/club-response';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClubService } from '../../services/club/club.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule
  ],
  providers: [
    DashboardService,
    ClubService
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  ownerId: string = '';
  clubs: ClubResponse[] = [];
  clubToDelete: ClubResponse | null = null;
  modalRef?: NgbModalRef;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService, 
    private clubService: ClubService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.params['owner_id'];
    this.loadClubs();
  }

  loadClubs(): void {
    this.dashboardService.getClubsByOwnerId(this.ownerId).subscribe({
      next: (data) => this.clubs = data,
      error: (err) => console.error('Error loading clubs', err)
    });
  }

  onCreateClub(): void {
    this.router.navigate(['/club/create-club', this.ownerId]);
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
