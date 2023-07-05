import { Component, OnInit, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { RentalFilmPayment } from '../Type/interface';

@Component({
  selector: 'app-rent-details',
  templateUrl: './rent-details.component.html',
  styleUrls: ['./rent-details.component.css']
})
export class RentDetailsComponent implements OnInit {

  film:  RentalFilmPayment;
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  storeSelected : boolean = false;

  public error: string | null | undefined;

  constructor(
    private _router: Router,
    private serviceRent: ServiceRentService,
    @Inject(DIALOG_DATA) public data: {film_rent: RentalFilmPayment},
    public dialogRef: DialogRef<any>
  ) {
    this.film= data.film_rent
  }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  click(selected: boolean) : void {
    this.storeSelected = selected
  }

  rent_page(film : any) : void{
    this._router.navigate(['rent', JSON.stringify(film)])
    this.closeDialog()

  }
}
