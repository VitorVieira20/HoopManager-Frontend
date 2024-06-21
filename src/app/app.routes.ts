import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactsComponent } from './pages/contacts/contacts.component';

export const routes: Routes = [
    {
        path: "dashboard/:owner_id",
        component: DashboardComponent
    },
    {
        path: "contacts/:club_id",
        component: ContactsComponent
    }
];
