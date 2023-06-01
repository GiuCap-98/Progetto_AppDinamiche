import { Component } from '@angular/core';

import { Router , ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-start-button',
  templateUrl: './start-button.component.html',
  styleUrls: ['./start-button.component.css']
})
export class StartButtonComponent {
  img_cinema:string= "assets/cinema_background.jpg";

  constructor(
    private _router: Router,
    private _activatedRoute:ActivatedRoute
    ) { }

  film_dashboard(){

    this._router.navigate(['dashboard']);
  }

}
