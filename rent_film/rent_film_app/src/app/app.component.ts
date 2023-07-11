import { Component, HostListener } from '@angular/core';
import { ServiceRentService } from './service/service-rent.service';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ServiceRentService]
})
export class AppComponent {
  title = 'rent_film_app';
  currentTheme!: string;
  theme: string = 'theme1-toolbar';


  constructor( public themeService: ThemeService, private serviceRent: ServiceRentService) {}

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
    });
  }

}
