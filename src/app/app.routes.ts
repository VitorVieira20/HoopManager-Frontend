import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { CreateClubComponent } from './pages/club/create-club/create-club.component';
import { EditClubComponent } from './pages/club/edit-club/edit-club.component';
import { TeamDashboardComponent } from './pages/team/team-dashboard/team-dashboard.component';
import { CreateTeamComponent } from './pages/team/create-team/create-team.component';
import { EditTeamComponent } from './pages/team/edit-team/edit-team.component';
import { PlayersDahshboardComponent } from './pages/player/players-dahshboard/players-dahshboard.component';
import { PlayersCreateComponent } from './pages/player/players-create/players-create.component';
import { ClubDashboardComponent } from './pages/club/club-dashboard/club-dashboard.component';
import { PlayersEditComponent } from './pages/player/players-edit/players-edit.component';
import { GamesDashboardComponent } from './pages/game/games-dashboard/games-dashboard.component';
import { GamesCreateComponent } from './pages/game/games-create/games-create.component';
import { GamesEditComponent } from './pages/game/games-edit/games-edit.component';
import { GameInfoDashboardComponent } from './pages/gameInfo/game-info-dashboard/game-info-dashboard.component';
import { GameInfoCreateComponent } from './pages/gameInfo/game-info-create/game-info-create.component';
import { GameInfoEditComponent } from './pages/gameInfo/game-info-edit/game-info-edit.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { OwnerGuard } from './guards/owner.guard';
import { HomeDashboardComponent } from './pages/home/home-dashboard/home-dashboard.component';
import { CalendarDashboardComponent } from './pages/calendar/calendar-dashboard/calendar-dashboard.component';

export const routes: Routes = [
    {
        path: 'dashboard/:owner_id',
        component: DashboardComponent,
        canActivate: [AuthGuard, OwnerGuard],
        children: [
          { path: 'home', component: HomeDashboardComponent },
          { path: 'clubs', component: ClubDashboardComponent },
          { path: 'clubs/create-club', component: CreateClubComponent },
          { path: 'clubs/edit-club/:club_id', component: EditClubComponent },
          { path: 'teams', component: TeamDashboardComponent },
          { path: 'teams/:club_id', component: TeamDashboardComponent },
          { path: 'teams/create-team/:club_id', component: CreateTeamComponent },
          { path: 'teams/edit-team/:team_id', component: EditTeamComponent },
          { path: 'players', component: PlayersDahshboardComponent },
          { path: 'players/:team_id', component: PlayersDahshboardComponent },
          { path: 'players/create-player/:team_id', component: PlayersCreateComponent },
          { path: 'players/edit-player/:player_id', component: PlayersEditComponent },
          { path: 'games', component: GamesDashboardComponent },
          { path: 'games/:team_id', component: GamesDashboardComponent },
          { path: 'games/create-game/:team_id', component: GamesCreateComponent },
          { path: 'games/edit-game/:game_id', component: GamesEditComponent },
          { path: 'gamesInfo/:game_id', component: GameInfoDashboardComponent },
          { path: 'gamesInfo/create-info/:game_id', component: GameInfoCreateComponent },
          { path: 'gamesInfo/edit-info/:game_info_id', component: GameInfoEditComponent },
          { path: 'contacts', component: ContactsComponent },
          { path: 'contacts/:club_id', component: ContactsComponent },
          { path: 'calendar/:team_id', component: CalendarDashboardComponent },
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignupComponent },
    { path: '', component: LoginComponent }
];
