import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { CreateClubComponent } from './pages/club/create-club/create-club.component';

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
    }
];
