import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceRentService } from '../service/service-rent.service';
import { Dialog} from '@angular/cdk/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { FilmDetailsComponent } from '../film-details/film-details.component';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Actor, FilmDetails, StoreOccorrency } from '../Type/interface';
import { Category } from '../Type/interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { MatDialogConfig } from '@angular/material/dialog';



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


  //variabili per il cambio tema
  currentTheme: string = 'theme1-other';
  coloreText!: string;

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
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreText = theme === 'theme1-toolbar' ? 'black' : 'white';
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

  getFilms(){
    this.serviceRent.getFilms(this.category, this.title, this.currentPage, this.pageSize).subscribe((response) => {
      this.films = response.data.films as FilmDetails[];
      this.getNumFilms()
    });

  }

  getNumFilms(){
    this.serviceRent.getNumFilms(this.category, this.title).subscribe((response: any) => {
      this.numFilms =  response.data.totalFilms;
      console.log(this.numFilms)
    });
  }

  onSearchTitleChange(event: any) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.title = event.target.value;
      this.getFilms();
    }, 500);
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

  rent_page(film : FilmDetails) : void{
    this.getStoresByFilm2(film.film).subscribe((storesByFilm: StoreOccorrency[]) => {
      this.count_numfilm=0
      this.storeAvailable(storesByFilm[0])
      this.storeAvailable(storesByFilm[1])
      if (this.isStoreAvailable) {
        this._router.navigate(['rent', JSON.stringify(film), JSON.stringify(storesByFilm)])
      } else {
        this.dialog.open(DialogComponentComponent, {data: {text:'Ci dispiace, il film non è disponibile per il noleggio.' }});
      }
    });
  }


  isSelected(category: Category): boolean {
    if(this.selectedOption === category){
      return true;
    }
    return false;
  }

  filterByCategory(category: Category) : void{
    this.selectedOption = category;
    const cat: Category = { name: ''}
    this.category = category.name
    this.getFilms()
  }




  // dialog for film details
  openDetails(film: FilmDetails) : void {
    this.getStoresByFilm2(film.film).subscribe((storesByFilm: StoreOccorrency[]) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {film_and_category: film, stores: storesByFilm};
      dialogConfig.width = '600px';
      dialogConfig.autoFocus = false;
      dialogConfig.ariaLabel =  film.film.title,
      dialogConfig.panelClass = 'custom-dialog-class'; // Aggiungi la classe CSS personalizzata al dialog

      this.dialog.open(FilmDetailsComponent, dialogConfig)
    });

  }



}
