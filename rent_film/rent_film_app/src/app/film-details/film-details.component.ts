import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private serviceRent: ServiceRentService,
    private location: Location,
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<FilmDetailsComponent>
  ) {
    this.film= data
  }

  ngOnInit(): void {
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
    this.getStores();
  }
  getFilm(): void {
    this.film_id = this.route.snapshot.paramMap.get('id')
    console.log(this.route.snapshot.paramMap.get('id'))
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  getStores() {
    this.serviceRent.getStores(this.film.film_id).subscribe((response) => {
      this.stores= response.data.stores;
    });
  }
}
