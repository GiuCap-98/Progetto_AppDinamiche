import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { RegistrationComponent } from './registration/registration.component';
import { RentComponent } from './rent/rent.component';
import { RentalListComponent } from './rental-list/rental-list.component';
import { AuthGuard } from './service/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent, canActivate : [AuthGuard],  title: 'Registration - RentApp' },
  { path:'dashboard', component: DashboardComponent, canActivate : [AuthGuard],  title: 'Dashboard - RentApp',
    children: [
      { path: '', component: FilmDetailsComponent , title: 'Film Details - RentApp'}
  ]},
  { path: 'rent/:film/:stores', component: RentComponent, canActivate : [AuthGuard], title: 'Rent Film - RentApp'},
  { path:'rental-list', component: RentalListComponent, canActivate : [AuthGuard], title: 'List Rent - RentApp'},
  {path : '404', component : NotFoundComponent},
  {path : '**', redirectTo : '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
