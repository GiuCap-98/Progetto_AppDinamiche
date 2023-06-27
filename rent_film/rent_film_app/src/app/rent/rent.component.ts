import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceRentService } from '../service/service-rent.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthServiceService } from '../service/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stores } from '../Type/Store';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css']
})
export class RentComponent implements OnInit{

  public error: string | null | undefined;
  form!: FormGroup;
  stores : Stores[]=[]
  stores_address:string[]=[]; // array to store the shops
  stores_num_film: number[]=[];
  film!: any;
  film_id!:any;
  dataSelected: boolean = false;
  storeSelected : boolean = false;
  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;



  constructor( private fb: FormBuilder, private serviceRent: ServiceRentService, private route: ActivatedRoute, private dialog: Dialog) {
      this.form = this.fb.group({
        data: ['', Validators.required],
        store: ['', Validators.required]
    });

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.film = params['film_title'];
      this.film_id = params['film_id']
      this.stores_address[0]= params['data1'];
      this.stores_address[1] = params['data2'];

      this.stores_num_film[0]= +params['store1_num_film'];
      this.stores_num_film[1] = +params['store2_num_film'];
    });

    this.stores = [
      { address: this.stores_address[0], num_film: this.stores_num_film[0]},
      { address: this.stores_address[1], num_film: this.stores_num_film[1]}]
    //this.stores= this.route.snapshot.paramMap.get('data_stores')

  }

  rent(){
    this.openDialog()
  }

  click_data(selected: boolean) {
    this.dataSelected = selected
  }
  click_store(selected: boolean) {
    this.storeSelected = selected
  }



  // dialog for film details
  openDialog() {
    //if(this.storeSelected && this.dataSelected){
    this.dialog.open(DialogComponentComponent, {data: {text:'Noleggio avvenuto con successo!' }});

    //}



  }


}
