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
  id : any;

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
    console.log(this.film)
  }

  getFilm(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    console.log(this.route.snapshot.paramMap.get('id'))
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
