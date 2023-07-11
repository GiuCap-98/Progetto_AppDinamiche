import { Component, OnInit, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

import { Router } from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../service/auth.service';
import { ThemeService } from '../service/theme.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { OverlayContainer } from '@angular/cdk/overlay';



@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{
  currentTheme!: string ;
  currentZoomLevel = 0;
  @ViewChild('slideToggler', { static: true })
  themeToggler!: MatSlideToggle;
  coloreText!: string;

  isDarkTheme = false;

  zoomIn(): void {
    this.currentZoomLevel += 10;
  }

  zoomOut(): void{
    this.currentZoomLevel -= 10;
  }



  constructor(
    private serviceRent: ServiceRentService,
    private authService: AuthService,
    private _router: Router,
    private themeService: ThemeService,
    readonly darkMode$: ThemeService,
    private overlayContainer: OverlayContainer) {}


  ngOnInit(): void {
    this.serviceRent.theme$.subscribe(theme => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreText = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }

  navigateToLogin() : void {
    this._router.navigate(['login'])
  }

  setValue(e : any){
    if(e.checked){

      this.changeTheme('theme2-toolbar');
      console.log('theme 2')
   }else{
    this.changeTheme('theme1-toolbar');
    console.log('theme 1')
   }
}

  home() : void{
    this._router.navigate(['dashboard'])
  }

  rentalList() : void {
    this._router.navigate(['rental-list'])
  }


  logout(): void {
    this.authService.logout();
  }

  changeTheme(theme: string) : void {
    this.currentTheme = theme;
    this.serviceRent.changeTheme(theme);
  }




}
