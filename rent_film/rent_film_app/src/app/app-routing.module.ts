import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { RegistrationComponent } from './registration/registration.component';
import { RentComponent } from './rent/rent.component';
import { RentalListComponent } from './rental-list/rental-list.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'registration',
        component: RegistrationComponent
      }

    ]
  },

  {
    path:'dashboard', component: DashboardComponent,
    children: [
      {
        path: ':id',
        component: FilmDetailsComponent
      }

    ]

  },
  //{ path: 'rent/:film_title/:film_id/:data1/:store1_num_film/:data2/:store2_num_film', component: RentComponent ,},

  { path: 'rent/:film/:stores', component: RentComponent},

  {
    path:'registration', component: RegistrationComponent

  },
  {
    path:'film-details', component: FilmDetailsComponent
  },
  {
    path:'rental-list', component: RentalListComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
