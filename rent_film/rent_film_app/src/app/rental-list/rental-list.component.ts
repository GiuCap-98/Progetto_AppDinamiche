import { Component, OnInit } from '@angular/core';
import { ServiceRentService } from '../service/service-rent.service';
import { PageEvent } from '@angular/material/paginator';
import { RentalFilmPayment } from '../Type/interface';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit{

  rentals: RentalFilmPayment[] = []; // array to store user rentals
  tot_sum   : number = 0;
  startIndex: number = 0;
  endIndex  : number = 10;
  pageSize  : number = 10;
  pageIndex : number = 0;
  pageSizeOptions : Array<number> = [5, 10, 20];

  currentTheme: string = 'theme1-other';
  coloreCard!: string;
  coloreTextCard!: string;

  constructor(
    private serviceRent: ServiceRentService, // iniettiamo il servizio
  ){}


  ngOnInit(): void {
    this.getRent();
    this.getSum();
  }

  // get all films from service
  getRent() : void {
    this.serviceRent.getRentalsByCustomer(544).subscribe((response) => {
      this.rentals = response.data.rentalsByCustomer as RentalFilmPayment[];
      this.updatePageIndex();
      //this.tot_sum : this.rentals = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    });
  }

  getSum() : void {
    this.serviceRent.getRentalsByCustomer(544).subscribe((response) => {
      this.rentals = response.data.rentalsByCustomer;
      this.updatePageIndex();
      //this.tot_sum : this.rentals = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    });
  }

  //
  updatePageIndex() : void {
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
  }

  onPageChange(event: PageEvent) : void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageIndex();
  }

}
