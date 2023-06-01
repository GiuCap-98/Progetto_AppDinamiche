import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

import { Router , ActivatedRoute} from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{
  isLoggedIn = this.servizioRent.getValue();

  ngOnInit(): void{
    console.log('disabled',this.isLoggedIn)

  }
  constructor( private servizioRent: ServiceRentService, private _router: Router, private _activatedRoute:ActivatedRoute) { }

  navigateToLogin() {
    this._router.navigate(['login'])
  }

  home(){
    this._router.navigate(['start-button'])
  }


  logout(): void {
    // Effettua il logout utilizzando il servizio AuthService
    this.servizioRent.setValue(false);
  }




}
