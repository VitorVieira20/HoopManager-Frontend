import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClubService } from '../../../services/club/club.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClubResponse } from '../../types/club-response';
import { ClubUpdateRequest } from '../../types/club-update-request';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface EditClubForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<number | null>;
  instagram: FormControl<string | null>;
  twitter: FormControl<string | null>;
  facebook: FormControl<string | null>;
}

@Component({
  selector: 'app-edit-club',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    ClubService
  ],
  templateUrl: './edit-club.component.html',
  styleUrls: ['./edit-club.component.scss']
})
export class EditClubComponent implements OnInit {

  editClubForm!: FormGroup<EditClubForm>;
  clubId: string = '';
  club: ClubResponse | null = null;  
  modalRef?: NgbModalRef;
  returnUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.clubId = this.route.snapshot.params['club_id'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    this.editClubForm = new FormGroup<EditClubForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(null),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      facebook: new FormControl('')
    });

    this.loadClubInfo();
  }

  loadClubInfo(): void {
    this.clubService.getClubById(this.clubId).subscribe({
      next: (data) => {
        this.club = data;
        this.editClubForm.patchValue({
          name: this.club.name,
          email: this.club.email,
          phone: this.club.phone,
          instagram: this.club.instagram,
          twitter: this.club.twitter,
          facebook: this.club.facebook
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
    this.onEditClub();
  }

  declineUpdate(): void {
    this.modalRef?.close();
  }

  onEditClub(): void {
    if (this.editClubForm.valid) {
      const clubUpdateRequest: ClubUpdateRequest = {
        name: this.editClubForm.value.name || '',
        email: this.editClubForm.value.email || '',
        phone: this.editClubForm.value.phone!,
        instagram: this.editClubForm.value.instagram || '',
        twitter: this.editClubForm.value.twitter || '',
        facebook: this.editClubForm.value.facebook || ''
      };

      this.clubService.updateClub(this.clubId, clubUpdateRequest).subscribe({
        next: () => {
          if (this.returnUrl === 'contacts') {
            this.router.navigate(['/dashboard', this.club?.owner_id, 'contacts', this.clubId]);
          } else if (this.returnUrl === 'club-dashboard') {
            this.router.navigate(['/dashboard', this.club?.owner_id, 'clubs']);
          } else {
            this.router.navigate(['/dashboard', this.club?.owner_id]);
          }
        },
        error: (err) => console.error('Error updating club', err)
      });
    }
  }

}
