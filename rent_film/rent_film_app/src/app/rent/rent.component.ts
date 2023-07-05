import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { FilmCategoryStore, StoreOccorrency } from '../Type/interface';
import { FilmCategory } from '../Type/Model';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css']
})
export class RentComponent implements OnInit{

  public error: string | null | undefined;
  form!: FormGroup;

  film!: FilmCategory;
  stores!: StoreOccorrency[];
  dataSelected: boolean = false;
  storeSelected : boolean = false;

  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;



  constructor( private fb: FormBuilder, private route: ActivatedRoute, private dialog: Dialog) {
      this.form = this.fb.group({
        data: ['', Validators.required],
        store: ['', Validators.required]
    });

  }

  ngOnInit() : void {
    this.route.params.subscribe(params => {
      this.film = JSON.parse(params['film']);
      this.stores = JSON.parse(params['stores']);

    });
  }



  rent() : void {
    this.openDialog()
  }

  click_data(selected: boolean) : void {
    this.dataSelected = selected
  }
  click_store(selected: boolean) : void {
    this.storeSelected = selected
  }



  // dialog for film details
  openDialog() : void {
    if(this.storeSelected && this.dataSelected){
      this.dialog.open(DialogComponentComponent, {data: {text:'Noleggio avvenuto con successo!' }});

    }



  }


}
