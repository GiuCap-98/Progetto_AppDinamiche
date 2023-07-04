import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ServiceRentService } from '../service/service-rent.service';
import {NgIf} from '@angular/common';
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { FilmCategoryStore } from '../Type/interface';



@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  styleUrls: ['./film-details.component.css']
})
export class FilmDetailsComponent implements OnInit {

  film:  FilmCategoryStore;
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  storeSelected : boolean = false;

  public error: string | null | undefined;

  constructor(
    private _router: Router,
    private serviceRent: ServiceRentService,
    @Inject(DIALOG_DATA) public data: {film_and_stores: FilmCategoryStore},
    public dialogRef: DialogRef<FilmDetailsComponent>
  ) {
    this.film= data.film_and_stores
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

  rent_page(film : FilmCategoryStore) : void{
    this._router.navigate(['rent', JSON.stringify(film)])
    this.closeDialog()

  }


}
