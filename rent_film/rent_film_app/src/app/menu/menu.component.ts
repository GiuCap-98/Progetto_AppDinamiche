import { Component } from '@angular/core';

import { Router , ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {


  constructor(private _router: Router, private _activatedRoute:ActivatedRoute) { }

  navigateToLogin() {
    this._router.navigate(['login'])
  }

}
