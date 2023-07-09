import { Component, OnInit, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

import { Router , ActivatedRoute} from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{
  currentTheme!: string ;

  constructor( private serviceRent: ServiceRentService, private _router: Router, private _activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  navigateToLogin() : void {
    this._router.navigate(['login'])
  }



  home() : void{
    this._router.navigate(['dashboard'])
  }

  rentalList() : void {
    this._router.navigate(['rental-list'])
  }


  logout(): void {
    // Effettua il logout utilizzando il servizio AuthService
    //this.servizioRent.setValue(false);
  }

  changeTheme(theme: string) : void {
    this.currentTheme = theme;
    this.serviceRent.changeTheme(theme);
  }




}
