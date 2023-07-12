import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceRentService } from '../service/service-rent.service';
import { Dialog} from '@angular/cdk/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { FilmDetailsComponent } from '../film-details/film-details.component';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { Actor, Category, FilmDetails, StoreOccorrency } from '../Type/interface';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
  searchControl : FormControl = new FormControl('');
  films!: FilmDetails[]; // array to store the films

  title: string = "";
  category : string= "";

  // variabili per la paginazione
  startIndex : number = 0;
  currentPage: number = 1;
  endIndex : number = 10;
  pageSize : number = 10;
  pageSizeOptions : Array<number> = [5, 10, 20];
  pageIndex : number = 0;

  //variabili per il bottone di ritorno ad inizio pagina
  isScrolled: boolean = false;
  scrolled = 0;
  //variabile per la selezione di una categoria (usata nell'html)
  selectedOption!: Category;

  //array per memorizzare le categorie
  categories: Category[] =[];

  storesByFilm: StoreOccorrency[] = [];
  numFilms: number = 0;
  timer: any;


  storeSelected : boolean = false;
  actors!: Actor[]
  isFilmPresent!: boolean ;
  isStoreAvailable: boolean =false;
  count_numfilm: number=0;

  constructor(
    private serviceRent: ServiceRentService,
    private authService: AuthService,
    public dialog: Dialog,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.authService.checkTokenExpiration()
    this.getNumFilms()
    this.getCategories();
    this.getFilms()
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


  //funzione che implementa la cattura di ogni modifica fatta nel searchbox per il film e cerca i film con quel termine
  onSearchTitleChange(event: any) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.title = event.target.value;
      this.getFilms();
    }, 500);
  }

  // per gestire il cambio pagina del paginator
  handlePageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getFilms();
  }


  getStoresByFilm(film: any): Observable<StoreOccorrency[]> {
    return this.serviceRent.getStores(film.film_id).pipe(
      map((response) => response.data.stores)
    );
  }


  getFilms(){
    this.serviceRent.getFilms(this.category, this.title, this.currentPage, this.pageSize).subscribe((response) => {
      this.films = response.data.films as FilmDetails[];
      this.getNumFilms()
    });

  }

  getNumFilms(){
    this.serviceRent.getNumFilms(this.category, this.title).subscribe((response: any) => {
      this.numFilms =  response.data.totalFilms;
    });
  }

  getCategories() : void{
    this.serviceRent.getCategories().subscribe((response) => {
      this.categories = response.data.categories as Category[];
    });
  }

  filterByCategory(category: Category) : void{
    this.selectedOption = category;
    this.category = category.name
    this.getFilms()
  }

  // controllo se il film è disponibile in qualche store
  storeAvailable(store: StoreOccorrency): boolean{
    if(store.num_film == 0){
      this.isFilmPresent = false;
    }else{
      this.count_numfilm+=1;
      this.isFilmPresent= true;
    }
    if((this.count_numfilm >= 1) ){
      this.isStoreAvailable=true;
    }
    return this.isFilmPresent
  }


  // per il controllo della selezione di una categoria
  isSelected(category: Category): boolean {
    if(this.selectedOption === category){
      return true;
    }
    return false;
  }



  // redirect to rent film page
  rent_page(film : FilmDetails) : void{
    this.getStoresByFilm(film.film).subscribe((storesByFilm: StoreOccorrency[]) => {
      this.count_numfilm=0
      this.storeAvailable(storesByFilm[0])
      this.storeAvailable(storesByFilm[1])
      if (this.isStoreAvailable) {
        this._router.navigate(['rent', JSON.stringify(film), JSON.stringify(storesByFilm)])
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {text:'Sorry, the film is not available for rent' };
        dialogConfig.ariaLabel =  'Not-available-rent'
        this.dialog.open(DialogComponentComponent,dialogConfig);
      }
    });
  }


   // dialog for film details
   openDetails(film: FilmDetails) : void {
    this.getStoresByFilm(film.film).subscribe((storesByFilm: StoreOccorrency[]) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {film_and_category: film, stores: storesByFilm};
      dialogConfig.width = '600px';
      dialogConfig.ariaLabel = 'Film Datails of '+ film.film.title,
      this.dialog.open(FilmDetailsComponent, dialogConfig)
    });

  }

}
