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

export const routes: Routes = [
    {
        path: "dashboard/:owner_id",
        component: DashboardComponent
    },
    {
        path: "contacts/:club_id",
        component: ContactsComponent
    },
    {
        path: "club/create-club/:owner_id",
        component: CreateClubComponent
    },
    {
        path: "club/edit-club/:club_id",
        component: EditClubComponent
    },
    {
        path: "teams/:club_id",
        component: TeamDashboardComponent
    },
    {
        path: "team/create-team/:club_id",
        component: CreateTeamComponent
    },
    {
        path: "team/edit-team/:team_id",
        component: EditTeamComponent
    },
    {
        path: "players/:team_id",
        component: PlayersDahshboardComponent
    },
    {
        path: "players/create-players/:team_id",
        component: PlayersCreateComponent
    }
];
