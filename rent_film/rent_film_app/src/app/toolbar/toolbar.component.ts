import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';



@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{


  constructor(
    private authService: AuthService,
    private _router: Router) {}


  ngOnInit(): void {
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
    this.authService.logout();
  }






}
