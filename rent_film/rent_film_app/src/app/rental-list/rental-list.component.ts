import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceRentService } from '../service/service-rent.service';
import { PageEvent } from '@angular/material/paginator';
import { RentalFilmPayment } from '../Type/interface';
import { Dialog} from '@angular/cdk/dialog';
import { RentDetailsComponent } from '../rent-details/rent-details.component';

import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit{

  displayedColumns: string[] = ['film', 'address', 'payment', 'rental', 'action'];
  rentals: RentalFilmPayment[] = []; // array to store user rentals
  columns_title: Array<string> = ['Film', 'Indirizzo', 'Pagamento', 'Data']
  columns_action:Array<string> = ['film', 'address', 'payment', 'rental']
  selectedOption!: String;
  isDropdownOpen: boolean = false;

  tot_sum   : number = 0;
  totalAmount: number = 0;

  startIndex: number = 0;
  endIndex  : number = 10;
  pageSize  : number = 10;
  pageIndex : number = 0;
  pageSizeOptions : Array<number> = [5, 10, 20];

  currentTheme: string = 'theme1-other';
  coloreCard!: string;
  coloreTextCard!: string;

  constructor(
    private serviceRent: ServiceRentService, private dialog : Dialog // iniettiamo il servizio
  ){}


  ngOnInit(): void {
    this.getRent();
  }

  openDropdown() {
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  sortData(sort: Sort) {
    const data = this.rentals.slice(); // Crea una copia dell'array rentals

    if (!sort.active || sort.direction === '') {
      // Non eseguire l'ordinamento se non è stata specificata alcuna colonna o direzione di ordinamento
      this.rentals = data;
      return;
    }

    // Ordina l'array in base alla colonna e alla direzione di ordinamento
    this.rentals = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'film':
          return this.compare(a.film.title, b.film.title, isAsc);
        case 'payment':
          return this.compare(a.payment.amount, b.payment.amount, isAsc);
        case 'rental':
          return this.compare(a.rental.rental_date, b.rental.rental_date, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    // Funzione di confronto per l'ordinamento
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }



  // get all films from service
  getRent() : void {
    this.serviceRent.getRentalsByCustomer(544).subscribe((response) => {
      this.rentals = response.data.rentalsByCustomer as RentalFilmPayment[];

       // Calcola la somma dei valori rental.payment.amount
      this.totalAmount = this.rentals.reduce((total, rental) => total + rental.payment.amount, 0);

      console.log(this.totalAmount)
      this.updatePageIndex();
    });
  }


  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageIndex();
  }
  updatePageIndex() : void {
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
  }



  // dialog for film details
  openDetails(rent: RentalFilmPayment) : void {
    this.dialog.open(RentDetailsComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '600px',
      data: {film_rent: rent}
    });
  }
}
