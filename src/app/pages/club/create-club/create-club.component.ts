import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClubService } from '../../../services/club.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClubRequest } from '../../types/club-request';

interface CreateClubForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<number | null>;
  instagram: FormControl<string | null>;
  twitter: FormControl<string | null>;
  facebook: FormControl<string | null>;
}

@Component({
  selector: 'app-create-club',
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
  templateUrl: './create-club.component.html',
  styleUrl: './create-club.component.scss'
})
export class CreateClubComponent implements OnInit{

  createClubForm!: FormGroup<CreateClubForm>;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private clubService: ClubService,
    private modalService: NgbModal
  ) {
    this.createClubForm = new FormGroup<CreateClubForm>({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(null),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      facebook: new FormControl(''),
    });
  }
 
  ownerId: string = '';
  modalRef?: NgbModalRef;

  ngOnInit(): void {
    this.ownerId = this.route.snapshot.params['owner_id'];
  }

  openConfirmationModal(content: TemplateRef<any>): void {
    this.modalRef = this.modalService.open(content);
  }

  confirmCreation(): void {
    this.modalRef?.close();
    this.onAddClub();
  }

  declineCreation(): void {
    this.modalRef?.close();
  }

  onAddClub() {
    if (this.createClubForm.valid) {
      const clubRequest: ClubRequest = {
        owner_id: this.ownerId,
        name: this.createClubForm.value.name!,
        email: this.createClubForm.value.email!,
        phone: this.createClubForm.value.phone!,
        instagram: this.createClubForm.value.instagram!,
        twitter: this.createClubForm.value.twitter!,
        facebook: this.createClubForm.value.facebook!,
      };

      this.clubService.createClub(clubRequest).subscribe({
        next: () => this.router.navigate(['/dashboard', this.ownerId]),
        error: (err) => console.error('Error creating club', err)
      });
    }
  }
}
