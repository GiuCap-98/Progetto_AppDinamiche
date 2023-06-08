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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  searchControl = new FormControl('');
  films: any[] = []; // array to store the films
  startIndex = 0;
  endIndex = 10;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
  pageIndex = 0;
  currentTheme: string = 'theme1-other';
  coloreCard!: string;
  coloreTextCard!: string;


  // se isFilm è null non mi ritorna i dettagli del film, altrimenti si
  isFilm!: boolean;
  isScrolled: boolean = false;
  scrolled = 0;
  elementOrigin = this.formatOrigin(null);
  subtreeOrigin = this.formatOrigin(null);
  @ViewChildren('filmElement') filmElements!: QueryList<any>; // QueryList for film elements

  constructor(
    private serviceRent: ServiceRentService, // iniettiamo il servizio
    public dialog: Dialog,
    private _ngZone: NgZone,
    private _cdr: ChangeDetectorRef
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

  formatOrigin(origin: FocusOrigin): string {
    return origin ? origin + ' focused' : 'blurred';
  }
  // Workaround for the fact that (cdkFocusChange) emits outside NgZone.
  markForCheck() {
    this._ngZone.run(() => this._cdr.markForCheck());
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
          // Focus the first film element when search results are updated
          this.setFocusOnFilmElement();
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageIndex();
  }

  // dialog for film details
  openDialog(film: any) {
    this.dialog.open(FilmDetailsComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '90%',
      maxHeight: '600px',
      data: film
    });
  }

  private setFocusOnFilmElement() {
    // Wait for the film elements to be available in the DOM
    this.filmElements.changes.subscribe(() => {
      // Check if there are any film elements
      if (this.filmElements.length > 0) {
        // Focus the first film element
        this.filmElements.first.nativeElement.focus();
      }
    });
  }
}
