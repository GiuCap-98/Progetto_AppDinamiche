import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServiceRentService } from '../service/service-rent.service';
import { Router } from 'express';
import { Dialog } from '@angular/cdk/dialog';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FilmDetailsComponent } from '../film-details/film-details.component';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-prova',
  templateUrl: './prova.component.html',
  styleUrls: ['./prova.component.css']
})
export class ProvaComponent implements OnInit{
  searchControl = new FormControl('')
  films: any[] = []; // array to store the films
  startIndex = 0;  endIndex = 10;
  pageSize = 10;  pageSizeOptions = [5, 10, 20];
  pageIndex = 0;
  
  //se isFilm è null non mi ritorna i dettagli del film, altrimenti si
  isFilm!: boolean;

  constructor(private serviceRent: ServiceRentService,  //iniettiamo il servizio
    public dialog: Dialog) {}

  ngOnInit(): void {
    this.getFilms();
    //this.searchFilms();
  }

  // get all films from service
  getFilms() { 
    this.serviceRent.getFilms().subscribe(response => { 
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
        distinctUntilChanged(), // 
        /* Pass the search term emitted by the observable to the searchFilms method, 
        / then map the result of the call to a new observable */
        switchMap((searchTerm: string | null) => this.serviceRent.searchFilms(searchTerm || ''))
      )
      // call subscribe on the observable returned by this.serviceRent.searchFilms
      .subscribe((response: any) => {
        const responseData: any = response.data;
        if (responseData) {
          this.films = responseData.searchFilms; // Aggiorna l'array films con i risultati della ricerca
        }
      });  
  }
  onPageChange(event: PageEvent) { 
    this.pageIndex = event.pageIndex; 
    this.pageSize = event.pageSize; 
    this.updatePageIndex(); 
  }
  /*
  // search films by title
  private searchFilms() {
    // emits a value whenever the value in the FormControl changes 
    this.searchControl.valueChanges
      .pipe( 
        // emits the most recent value after a delay of 300 milliseconds from the end of the last output value
        debounceTime(300),
        // emits the most recent value only if different from the previous one
        distinctUntilChanged(), // 
        /* Pass the search term emitted by the observable to the searchFilms method, 
        / then map the result of the call to a new observable */
        /*switchMap((searchTerm: string | null) => this.serviceRent.searchFilms(searchTerm || ''))
      )
      // call subscribe on the observable returned by this.serviceRent.searchFilms
      .subscribe((response: any) => {
        const responseData: any = response.data;
        if (responseData) {
          this.films = responseData.searchFilms; // Aggiorna l'array films con i risultati della ricerca
        }
      });  
  }
  */
  // dialog for film details
  openDialog(film:any) {
    this.dialog.open(FilmDetailsComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '600px',
      data: film
    });
    }
    
}

