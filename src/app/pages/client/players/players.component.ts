import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { PlayerService } from '../../../services/player/player.service';
import { UserResponse } from '../../types/user-response';
import { PlayerResponse } from '../../types/player-response';
import { UserUpdateRequest } from '../../types/user-update-request';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    PlayerService,
    UserService
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  userId: string = '';
  playerId: string = '';
  player: PlayerResponse = {id: '', name: '', position: '', team_id: ''};
  playersSearch: PlayerResponse[] = [];
  favoritePlayers: PlayerResponse[] = [];
  filteredFavoritePlayers: PlayerResponse[] = [];
  user: UserResponse = {id: '', name: '', email: '', role: '', plan: '', clubs: [''], teams: [''], games: [''], players: ['']};
  showAddConfirmationModal: boolean = false;
  showRemoveConfirmationModal: boolean = false;
  playerToRemove: string | null = null;
  playerToAdd: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.parent?.snapshot.params['user_id'];
    this.playerId = this.route.snapshot.params['player_id'];
    if (this.player) {
      this.loadPlayerInfo(this.playerId);
    }
    this.loadFavoritePlayers();
  }

  loadPlayerInfo(teamId: string) {
    this.playerService.getPlayerById(teamId).subscribe({
      next: (data) => this.player = data,
      error: (err) => console.log('Error while loading team information: ', err)
    });
  }

  private filterFavoritePlayers(players: PlayerResponse[]): PlayerResponse[] {
    const favoriteTeamsIds = new Set(this.favoritePlayers.map(player => player.id));
    return players.filter(player => !favoriteTeamsIds.has(player.id));
  }

  loadPlayers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const playerName = input.value;

    if (playerName === '') {
      this.playersSearch = [];
    } else {
      this.playerService.getPlayersByName(playerName).subscribe({
        next: (data) => {
          if (data) {
            this.playersSearch = this.filterFavoritePlayers(data);
          } else {
            this.playersSearch = [];
          }
        },
        error: (err) => console.log('Error while searching for clubs:', err)
      });
    }
  }

  loadFavoritePlayers(): void {
    this.playerService.getFavoritePlayersByUserId(this.userId).subscribe({
      next: (data) => {
        if (data) {
          this.favoritePlayers = data;
          this.filteredFavoritePlayers = this.playerId ? data.filter(player => player.id !== this.playerId) : data;
        } else {
          console.log('No favorite clubs data received.');
        }
      },
      error: (err) => {
        console.log('Error while loading favorite clubs:', err);
        this.favoritePlayers = [];
        this.filteredFavoritePlayers = [];
      }
    });
  }

  showRemoveFavoriteModal(playerId: string): void {
    this.showRemoveConfirmationModal = true;
    this.playerToRemove = playerId;
  }

  showAddFavoriteModal(playerId: string): void {
    this.showAddConfirmationModal = true;
    this.playerToAdd = playerId;
  }

  confirmRemoveFavorite(): void {
    if (this.playerToRemove) {
      const updatedFavoritesIds = this.favoritePlayers.filter(player => player.id !== this.playerToRemove).map(player => player.id);

      const updateUserRequest: UserUpdateRequest = { players: updatedFavoritesIds };

      this.userService.updateUser(this.userId, updateUserRequest).subscribe({
        next: (data) => {
          this.user = data;
          this.favoritePlayers = this.favoritePlayers.filter(player => player.id !== this.playerToRemove);
          this.showRemoveConfirmationModal = false;
          this.playerToRemove = null;
          this.router.navigate([this.router.url]).then(() => {
            this.searchInput.nativeElement.value = '';
            this.loadFavoritePlayers()
            this.playersSearch = [];
          });
        },
        error: (err) => console.log('Error while updating user information:', err)
      });
    }
  }

  confirmAddFavorite(): void {
    if (this.playerToAdd) {
      const updatedFavoritesIds = [...this.favoritePlayers.map(player => player.id), this.playerToAdd];

      const updateUserRequest: UserUpdateRequest = { players: updatedFavoritesIds };

      this.userService.updateUser(this.userId, updateUserRequest).subscribe({
        next: (data) => {
          this.user = data;
          this.favoritePlayers.push(this.playersSearch.find(player => player.id === this.playerToAdd)!);
          this.showAddConfirmationModal = false;
          this.playerToAdd = null;
          this.router.navigate([this.router.url]).then(() => {
            this.searchInput.nativeElement.value = '';
            this.loadFavoritePlayers()
            this.playersSearch = [];
          });
        },
        error: (err) => console.log('Error while updating user information:', err)
      });
    }
  }

  cancelRemoveFavorite(): void {
    this.showRemoveConfirmationModal = false;
    this.playerToRemove = null;
  }

  cancelAddFavorite(): void {
    this.showAddConfirmationModal = false;
    this.playerToAdd = null;
  }

}
