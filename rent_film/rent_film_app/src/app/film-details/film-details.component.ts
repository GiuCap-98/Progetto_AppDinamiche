import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRentService } from '../service/service-rent.service';
import { DialogRef, DIALOG_DATA} from '@angular/cdk/dialog';
import { FilmDetails, StoreOccorrency, Actor } from '../Type/interface';



@Component({
  selector: 'app-film-details',
  templateUrl: './film-details.component.html',
  styleUrls: ['./film-details.component.css'],
})
export class FilmDetailsComponent implements OnInit {

  film:  FilmDetails;
  stores!: StoreOccorrency[];
  storeSelected : boolean = false;
  actors!: Actor[]
  isFilmPresent!: boolean ;
  isStoreAvailable: boolean =false;
  count_numfilm: number=0;
  filmTitle!: string;

  constructor(
    private _router: Router,
    private serviceRent: ServiceRentService,
    @Inject(DIALOG_DATA) public data: {film_and_category: FilmDetails, stores: StoreOccorrency[]},
    public dialogRef: DialogRef<FilmDetailsComponent>
  ) {
    this.film= data.film_and_category
    this.stores= data.stores
    this.filmTitle = data.film_and_category.film.title;
  }

  ngOnInit(): void {
    this.count_numfilm=0;
    this.isStoreAvailable=false;
    this.getActors(this.film.film.film_id)
  }

  getActors(film_id:number): void {
    this.serviceRent.getActors(film_id).subscribe((response) => {
      this.actors = response.data.searchActorsByFilm as Actor[];
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
    // Naviga all'URL della dashboard
    this._router.navigate(['dashboard']);
  }

  click(selected: boolean) : void {
    this.storeSelected = selected
  }

  rent_page(film : FilmDetails, stores: StoreOccorrency[]) : void{
    this.closeDialog()
    this._router.navigate(['rent', JSON.stringify(film), JSON.stringify(stores)])


  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const selectedOption = document.activeElement as HTMLElement;
      this.click(selectedOption.getAttribute('aria-selected') === 'true');
    }
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

}
