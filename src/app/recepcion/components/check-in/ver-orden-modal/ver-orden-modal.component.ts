import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdenVenta } from 'src/app/models/orden-venta';

@Component({
  selector: 'app-ver-orden-modal',
  templateUrl: './ver-orden-modal.component.html',
  styleUrls: ['./ver-orden-modal.component.css']
})
export class VerOrdenModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
    modelo:OrdenVenta=null
  ngOnInit(): void {
    console.log(this.data)
    if(this.data){
      this.modelo=this.data.orden
    }
  }

}
