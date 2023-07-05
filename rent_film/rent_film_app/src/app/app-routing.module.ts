import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { RegistrationComponent } from './registration/registration.component';
import { RentComponent } from './rent/rent.component';
import { RentalListComponent } from './rental-list/rental-list.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'registration', component: RegistrationComponent },

  { path:'dashboard', component: DashboardComponent, canActivate : [AuthGuard],
    children: [ { path: ':id', component: FilmDetailsComponent }]
  },

  { path: 'rent/:film/:stores', component: RentComponent, canActivate : [AuthGuard]},
  
  { path:'film-details', component: FilmDetailsComponent, canActivate : [AuthGuard]},
  
  { path:'rental-list', component: RentalListComponent, canActivate : [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
