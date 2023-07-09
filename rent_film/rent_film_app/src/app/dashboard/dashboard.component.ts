import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ServiceRentService } from '../service/service-rent.service';
import { Dialog} from '@angular/cdk/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { FilmDetailsComponent } from '../film-details/film-details.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FilmDetails, StoreOccorrency, Tot_Films } from '../Type/interface';
import { Category } from '../Type/interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  searchControl : FormControl = new FormControl('');
  films: FilmDetails[] = []; // array to store the films

  // variabili per la paginazione
  startIndex : number = 0;
  currentPage: number = 1;
  endIndex : number = 10;
  pageSize : number = 10;
  pageSizeOptions : Array<number> = [5, 10, 20];
  pageIndex : number = 0;


  //variabili per il cambio tema
  currentTheme: string = 'theme1-other';
  coloreCard!: string;
  coloreTextCard!: string;

  //variabili per il bottone di ritorno ad inizio pagina
  isScrolled: boolean = false;
  scrolled = 0;
  //variabile per la selezione di una categoria (usata nell'html)
  selectedOption!: Category;

  //array per memorizzare le categorie
  categories: Category[] =[];

  storesByFilm: StoreOccorrency[] = [];
  isFilmPresent!: boolean ;

  numFilms: number = 0;

  constructor(
    private serviceRent: ServiceRentService,
    public dialog: Dialog,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getFilms();
    this.serviceRent.getNumFilms().subscribe((result: any) => {
      this.numFilms = result.data.totalFilms;
      console.log(this.numFilms)
    });
    this.searchFilms();
    this.getCategories();
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
  }

  // Funzioni per il bottone di ritorno ad inizo pagina
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() : void {
    const numb = window.scrollY;
    if (numb >= 50) {
      this.scrolled = 1;
    } else {
      this.scrolled = 0;
    }
  }

  scrollToTop() : void{
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



  // get all films from service
  getFilms() : void {
    this.serviceRent.getFilms(this.currentPage, this.pageSize).subscribe((response) => {
      this.films = response.data.films as FilmDetails[];
      console.log(this.films.length)
       // Aggiungi il calcolo del totale dei film nel server
    });

  }

  handlePageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getFilms();
  }


  getStoresByFilm(film: any)  {
    this.serviceRent.getStores(film.film_id).subscribe((response) => {
      this.storesByFilm= response.data.stores;

    });


  }

  getStoresByFilm2(film: any): Observable<StoreOccorrency[]> {
    return this.serviceRent.getStores(film.film_id).pipe(
      map((response) => response.data.stores)
    );
  }

  getCategories() : void{
    this.serviceRent.getCategories().subscribe((response) => {
      this.categories = response.data.categories as Category[];
    });
  }


  updatePageIndex() : void {
    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
  }

  // search films by title
  private searchFilms() : void{
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
          this.films = responseData.searchFilms as FilmDetails[]; // Aggiorna l'array films con i risultati della ricerca
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageIndex();
  }


  rent_page(film : FilmDetails) : void{
    this.getStoresByFilm2(film.film).subscribe((storesByFilm: StoreOccorrency[]) => {
      if (storesByFilm[0].num_film || storesByFilm[1].num_film) {
        this.isFilmPresent = true;
        this._router.navigate(['rent', JSON.stringify(film), JSON.stringify(storesByFilm)])
      } else {
        this.isFilmPresent = false;
        this.dialog.open(DialogComponentComponent, {data: {text:'Ci dispiace, il film non è disponibile per il noleggio.' }});
      }
      console.log(this.isFilmPresent);
    });
    /*
    this.getStoresByFilm(film.film)
    if(this.storesByFilm[0].num_film || this.storesByFilm[1].num_film){
      this.isFilmPresent= true
    }else{
      this.isFilmPresent= false
    }
    console.log(this.isFilmPresent)
    */
    /*
    if(film.stores[0].num_film || film.stores[1].num_film){
      this._router.navigate(['rent', JSON.stringify(film)])
    }else{
      this.dialog.open(DialogComponentComponent, {data: {text:'Ci dispiace, il film non è disponibile per il noleggio.' }});

    }
    */

  }


  isSelected(category: Category): boolean {
    if(this.selectedOption === category){
      return true;
    }
    return false;
  }

  filterByCategory(category: Category) : void{
    this.selectedOption = category;
    this.serviceRent.searchFilmsByCategory(category.name).subscribe((response) => {
      this.films = response.data.searchFilmsByCategory as FilmDetails[];  // Aggiorna l'array films con i risultati della ricerca

    });
  }




  // dialog for film details
  openDetails(film: FilmDetails) : void {
    this.getStoresByFilm2(film.film).subscribe((storesByFilm: StoreOccorrency[]) => {
      this.dialog.open(FilmDetailsComponent, {
        width: '90%',
        maxWidth: '800px',
        height: '90%',
        maxHeight: '600px',
        data: {film_and_category: film, stores: storesByFilm}
      });
    });

  }


  /*
  getStores() {
    this.serviceRent.getStores(this.films).subscribe((response) => {
      this.stores= response.data.stores;
    });
  }



  getStoresByFilm(film: any): boolean {
    this.serviceRent.getStores(film.film_id).subscribe((response) => {
      this.storesByFilm= response.data.stores;

    });
    console.log( this.storesByFilm.every(store => store.num_film === 0));
    return  this.storesByFilm.every(store => store.num_film === 0);

  }
  */


}
