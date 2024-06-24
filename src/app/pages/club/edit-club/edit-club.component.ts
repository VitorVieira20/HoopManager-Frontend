import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClubService } from '../../../services/club.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    ClubService
  ],
  templateUrl: './edit-club.component.html',
  styleUrl: './edit-club.component.scss'
})
export class EditClubComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private clubService: ClubService) {}

  clubId: string = '';

  ngOnInit(): void {
    this.clubId = this.route.snapshot.params['club_id'];
  }

}
