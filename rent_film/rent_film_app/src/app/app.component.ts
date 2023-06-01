import { Component } from '@angular/core';
import { ServiceRentService } from './service/service-rent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ServiceRentService]
})
export class AppComponent {
  title = 'rent_film_app';
}
