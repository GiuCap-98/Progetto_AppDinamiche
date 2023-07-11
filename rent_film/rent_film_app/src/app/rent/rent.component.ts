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


  theme: string = 'theme1-toolbar';
  currentTheme!: string;
  coloreCard!: string;
  coloreTextCard!: string;
  data_selected: string = '';
  store_selected: string = '';
  data_group : string[]= [ 'Today', 'In two days' ]


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
    this.serviceRent.theme$.subscribe((theme) => {
      this.currentTheme = theme === 'theme1-toolbar' ? 'theme1-other' : 'theme2-other';
      this.coloreCard = theme === 'theme1-toolbar' ? '#e8e8e8' : '#2E343B';
      this.coloreTextCard = theme === 'theme1-toolbar' ? 'black' : 'white';
    });
  }



  rent() : void {
    this.errors=[]
    if (this.data_selected=='' ||  this.store_selected == '') {
      console.log(this.data_selected)
      // Verifica se il campo data è vuoto
      if (this.data_selected=='') {
        this.errors.push('Il campo data è obbligatorio.')
        console.log(this.errors)
      }
      // Verifica se il campo store è vuoto
      if (this.store_selected=='') {
        this.errors.push('Il campo store è obbligatorio.');
      }

    }else{
      this.openDialog()
    }
  }

  click_data(selected: boolean) : void {
    this.dataSelected = selected
  }
  click_store(selected: boolean) : void {
    this.storeSelected = selected
  }



  // dialog for film details
  openDialog() : void {
    if(this.store_selected!='' && this.data_selected!=''){
      this.dialog.open(DialogComponentComponent, {data: {text:'Noleggio avvenuto con successo!' }});
    }
  }


}
