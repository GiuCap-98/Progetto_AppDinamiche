import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import {A11yModule, FocusOrigin} from '@angular/cdk/a11y';
import {ChangeDetectorRef, NgZone} from '@angular/core';

import { ServiceRentService } from '../service/service-rent.service';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { FilmDetailsComponent } from '../film-details/film-details.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import axe from 'axe-core';
import { Router } from '@angular/router';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  searchControl = new FormControl('');
  films: any[] = []; // array to store the films
  storesByFilm: any[] = [];
  stores: any[] = []; // array to store the shops
  startIndex = 0;
  endIndex = 10;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
  pageIndex = 0;
  currentTheme: string = 'theme1-other';
  coloreCard!: string;
  coloreTextCard!: string;
  disableRent: boolean = false;
  disponibile!: boolean;

  public error: any | null | undefined;



  // se isFilm è null non mi ritorna i dettagli del film, altrimenti si
  isFilm!: boolean;
  isScrolled: boolean = false;
  scrolled = 0;
  //@ViewChildren('filmElement') filmElements!: QueryList<any>; // QueryList for film elements


  constructor(
    private serviceRent: ServiceRentService, // iniettiamo il servizio
    public dialog: Dialog,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getFilms();
    this.searchFilms();
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });



  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const numb = window.scrollY;
    if (numb >= 50) {
      this.scrolled = 1;
    } else {
      this.scrolled = 0;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // get all films from service
  getFilms() {
    this.serviceRent.getFilms().subscribe((response) => {
      this.films = response.data.films;
      this.updatePageIndex();
    });
  }

  updatePageIndex() {
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
  }

  // search films by title
  private searchFilms() {
    // emits a value whenever the value in the FormControl changes
    this.searchControl.valueChanges
      .pipe(
        // emits the most recent value after a delay of 300 milliseconds from the end of the last output value
        debounceTime(300),
        // emits the most recent value only if different from the previous one
        distinctUntilChanged(),
        /* Pass the search term emitted by the observable to the searchFilms method,
        / then map the result of the call to a new observable */
        switchMap((searchTerm: string | null) => this.serviceRent.searchFilms(searchTerm || ''))
      )
      // call subscribe on the observable returned by this.serviceRent.searchFilms
      .subscribe((response: any) => {
        const responseData: any = response.data;
        if (responseData) {
          this.films = responseData.searchFilms; // Aggi
          this.films = responseData.searchFilms; // Aggiorna l'array films con i risultati della ricerca
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageIndex();
  }


  rent_page(film : any){

    if(!this.getStoresByFilm(film)){
      this._router.navigate(['rent', film.title, film.film_id, this.storesByFilm[0].address,this.storesByFilm[0].num_film,this.storesByFilm[1].address, this.storesByFilm[1].num_film  ])
    }else{
      this.dialog.open(DialogComponentComponent, {data: {text:'Ci dispiace, il film non è disponibile per il noleggio.' }});

    }

  }

  getStoresByFilm(film: any): boolean {
    this.serviceRent.getStores(film.film_id).subscribe((response) => {
      this.storesByFilm= response.data.stores;

    });
    console.log( this.storesByFilm.every(store => store.num_film === 0));
    return  this.storesByFilm.every(store => store.num_film === 0);

  }

  getStores() {
    this.serviceRent.getStores(this.films).subscribe((response) => {
      this.stores= response.data.stores;
    });
  }




  // dialog for film details
  openDialog(film: any) {
    this.getStoresByFilm(film)
    this.dialog.open(FilmDetailsComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '600px',
      data: {film: film, stores: this.storesByFilm }
    });
  }


}
