import { Component } from '@angular/core';

import { Router , ActivatedRoute} from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';

@Component({
  selector: 'app-start-button',
  templateUrl: './start-button.component.html',
  styleUrls: ['./start-button.component.css']
})
export class StartButtonComponent {
  currentTheme!: string;

  constructor(
    private _router: Router,
    private _activatedRoute:ActivatedRoute,
    private serviceRent: ServiceRentService
    ) { }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1' ? 'theme2' : 'theme1';
    });
  }


  film_dashboard(){

    this._router.navigate(['dashboard']);
  }

}
