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
export class RentDetailsComponent {

  film:  RentalFilmPayment;
  storeSelected : boolean = false;

  public error: string | null | undefined;

  constructor(
    private _router: Router,
    @Inject(DIALOG_DATA) public data: {film_rent: RentalFilmPayment},
    public dialogRef: DialogRef<any>
  ) {
    this.film= data.film_rent
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
