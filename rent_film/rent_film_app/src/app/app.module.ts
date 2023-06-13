import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import { MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ScrollingModule} from "@angular/cdk/scrolling";
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProvaComponent } from './prova/prova.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { A11yModule } from '@angular/cdk/a11y';
import { MatSelectModule } from '@angular/material/select';
import { RentalListComponent } from './rental-list/rental-list.component';



const modules = [
  BrowserModule,
  AppRoutingModule,
  GraphQLModule,
  HttpClientModule,
  BrowserAnimationsModule,
  MatSlideToggleModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  ScrollingModule,
  ScrollingModule,
  DialogModule,
  MatFormFieldModule,
  MatPaginatorModule,
  A11yModule,
  MatSelectModule
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MenuComponent,
    StartButtonComponent,
    DashboardComponent,
    LoginComponent,
    FilmDetailsComponent,
    ProvaComponent,
    RentalListComponent
  ],

  imports: modules,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
