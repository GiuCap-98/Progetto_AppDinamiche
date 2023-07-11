import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { FilmCategoryStore, StoreOccorrency } from '../Type/interface';
import { FilmCategory } from '../Type/Model';
import { ServiceRentService } from '../service/service-rent.service';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.css']
})
export class RentComponent implements OnInit{

  public errors: string[]= [];
  form!: FormGroup;

  film!: FilmCategory;
  stores!: StoreOccorrency[];
  dataSelected: boolean = false;
  storeSelected : boolean = false;


  constructor( private fb: FormBuilder, private route: ActivatedRoute, private dialog: Dialog, private serviceRent: ServiceRentService) {
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
    this.errors=[]
    if(this.storeSelected && this.dataSelected){ 
      this.dialog.open(DialogComponentComponent, {data: {text:'Noleggio avvenuto con successo!' }}); 
 
    }else{
      if (!this.storeSelected ) {
        this.errors.push('The field store is required')
        console.log(this.errors)
      }
      // Verifica se il data store è vuoto
      if (!this.dataSelected) {
        this.errors.push('The field data is required');
      }
    }
  } 


}
