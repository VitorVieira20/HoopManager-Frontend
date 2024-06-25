import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClubService } from '../../../services/club.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';
import { ClubResponse } from '../../types/club-response';
import { ClubUpdateRequest } from '../../types/club-update-request';

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
    ReactiveFormsModule
  ],
  providers: [
    ClubService,
    DashboardService
  ],
  templateUrl: './edit-club.component.html',
  styleUrls: ['./edit-club.component.scss']
})
export class EditClubComponent implements OnInit {

  editClubForm!: FormGroup<EditClubForm>;
  clubId: string = '';
  club: ClubResponse | null = null;  // Inicia como null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.clubId = this.route.snapshot.params['club_id'];
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
    this.dashboardService.getClubById(this.clubId).subscribe({
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
          this.router.navigate(['/dashboard', this.club?.owner_id])
        },
        error: (err) => console.error('Error updating club', err)
      });
    }
  }

}
