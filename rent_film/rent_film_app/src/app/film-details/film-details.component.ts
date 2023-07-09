import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ServiceRentService } from '../service/service-rent.service';
import {NgIf} from '@angular/common';
import { DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { FilmDetails, StoreOccorrency, Actor } from '../Type/interface';



@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  styleUrls: ['./film-details.component.css']
})
export class FilmDetailsComponent implements OnInit {

  film:  FilmDetails;
  stores!: StoreOccorrency[];
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  storeSelected : boolean = false;
  actors!: Actor[]



  public error: string | null | undefined;

  constructor(
    private _router: Router,
    private serviceRent: ServiceRentService,
    @Inject(DIALOG_DATA) public data: {film_and_category: FilmDetails, stores: StoreOccorrency[]},
    public dialogRef: DialogRef<FilmDetailsComponent>
  ) {
    this.film= data.film_and_category
    this.stores= data.stores
  }

  ngOnInit(): void {
    this.getActors(this.film.film.film_id)
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
  }

  getActors(film_id:number): void {
    this.serviceRent.getActors(film_id).subscribe((response) => {
      this.actors = response.data.searchActorsByFilm as Actor[];
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  click(selected: boolean) : void {
    this.storeSelected = selected
  }

  rent_page(film : FilmDetails, stores: StoreOccorrency[]) : void{
    this._router.navigate(['rent', JSON.stringify(film), JSON.stringify(stores)])
    this.closeDialog()

  }


}
