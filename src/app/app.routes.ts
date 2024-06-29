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

export const routes: Routes = [
    {
        path: 'dashboard/:owner_id',
        component: DashboardComponent,
        children: [
          { path: 'clubs', component: ClubDashboardComponent },
          { path: 'clubs/create-club', component: CreateClubComponent },
          { path: 'teams', component: TeamDashboardComponent },
          { path: 'teams/:club_id', component: TeamDashboardComponent },
          { path: 'teams/create-team/:club_id', component: CreateTeamComponent },
          { path: 'teams/edit-team/:team_id', component: EditTeamComponent },
          { path: 'players', component: PlayersDahshboardComponent },
          { path: 'players/:team_id', component: PlayersDahshboardComponent },
          { path: 'players/create-player/:team_id', component: PlayersCreateComponent },
          { path: 'players/edit-player/:player_id', component: PlayersEditComponent },
          { path: 'contacts', component: ContactsComponent },
          { path: 'contacts/:club_id', component: ContactsComponent },
        ]
    },
];
