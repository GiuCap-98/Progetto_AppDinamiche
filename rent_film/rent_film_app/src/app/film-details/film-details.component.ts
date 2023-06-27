import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ServiceRentService } from '../service/service-rent.service';
import {NgIf} from '@angular/common';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';



@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  styleUrls: ['./film-details.component.css']
})
export class FilmDetailsComponent implements OnInit {

  film:  any;
  stores: any[] = []; // array to store the shops
  film_id : any;
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  storeSelected : boolean = false;

  public error: string | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private serviceRent: ServiceRentService,
    private location: Location,
    @Inject(DIALOG_DATA) public data: {film: any, stores: any},
    public dialogRef: DialogRef<FilmDetailsComponent>
  ) {
    this.film= data.film
    this.stores= data.stores
  }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });

    this.error= this.data.stores[0]
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  click(selected: boolean) {
    this.storeSelected = selected
  }

  rent_page(){
    this._router.navigate(['rent', this.film.title, this.film.film_id, this.stores[0].address,this.stores[0].num_film,this.stores[1].address, this.stores[1].num_film  ])
    this.closeDialog()

  }

}
