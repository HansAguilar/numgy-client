import { Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: ChallengeComponent,
        title: "ChallengeComponent",
    },
    {
        path: "welcome",
        component: DashboardComponent,
        title: "DashboardComponent",
        canActivate: [authGuard]
    }
];
