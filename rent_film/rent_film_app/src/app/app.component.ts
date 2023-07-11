import { Component, HostListener } from '@angular/core';
import { ServiceRentService } from './service/service-rent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ServiceRentService]
})
export class AppComponent {
  title = 'rent_film_app';
  fontSizePercentage = 100;

  increaseFontSize() {
    this.fontSizePercentage += 10;
    this.updateFontSize();
  }

  decreaseFontSize() {
    this.fontSizePercentage -= 10;
    this.updateFontSize();
  }

  updateFontSize() {
    document.documentElement.style.fontSize = this.fontSizePercentage + '%';
  }

  // Aggiungi questo metodo per consentire l'ascolto dell'evento di ridimensionamento della finestra
  @HostListener('window:resize')
  onWindowResize() {
    this.updateFontSize();
  }
}
