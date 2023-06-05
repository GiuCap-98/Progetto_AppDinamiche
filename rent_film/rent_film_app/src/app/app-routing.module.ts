import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartButtonComponent } from './start-button/start-button.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { ProvaComponent } from './prova/prova.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },

  {
    path:'dashboard', component: DashboardComponent,
    children: [
      { path: ':id', component: FilmDetailsComponent }
    ]

  },
  {
    path:'start-button', component: StartButtonComponent

  },
  {
    path:'film-details', component: FilmDetailsComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
