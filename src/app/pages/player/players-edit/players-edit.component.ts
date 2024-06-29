import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from '../../../services/player/player.service';

@Component({
  selector: 'app-players-edit',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    PlayerService
  ],
  templateUrl: './players-edit.component.html',
  styleUrl: './players-edit.component.scss'
})
export class PlayersEditComponent implements OnInit {

  ownerId: string = '';
  clubId: string = '';
  teamId: string = '';
  playerId: string = '';

  constructor(
    private route: ActivatedRoute, 
    private playerService: PlayerService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ownerId = this.route.parent?.snapshot.params['owner_id'];
    this.playerId = this.route.snapshot.params['player_id'];
  }

}