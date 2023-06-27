import { Component, OnInit } from '@angular/core';
import { FilmDetailsComponent } from '../film-details/film-details.component';
import { Dialog } from '@angular/cdk/dialog';
import { ServiceRentService } from '../service/service-rent.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit{

  rentals: any[] = []; // array to store user rentals
  tot_sum    = 0;
  startIndex = 0;
  endIndex   = 10;
  pageSize   = 10;
  pageIndex  = 0;
  pageSizeOptions = [5, 10, 20];
  currentTheme: string = 'theme1-other';
  coloreCard!: string;
  coloreTextCard!: string;

  constructor(
    private serviceRent: ServiceRentService, // iniettiamo il servizio
    private dialog: Dialog,

  ){

  }
  ngOnInit(): void {
    this.getRent();
    this.getSum();
  }

  // get all films from service
  getRent() {
    this.serviceRent.getRentalsByCustomer(544).subscribe((response) => {
      this.rentals = response.data.rentalsByCustomer;
      this.updatePageIndex();
      //this.tot_sum : this.rentals = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    });
  }

  getSum() {
    this.serviceRent.getRentalsByCustomer(544).subscribe((response) => {
      this.rentals = response.data.rentalsByCustomer;
      this.updatePageIndex();
      //this.tot_sum : this.rentals = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    });
  }

  //
  updatePageIndex() {
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageIndex();
  }

}
