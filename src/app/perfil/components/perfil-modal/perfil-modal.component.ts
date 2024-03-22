import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil-modal',
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css']
})
export class PerfilModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,){}

  username:string=''
  editarCampos:boolean=true
  ngOnInit(): void {
    this.username=this.data.user
  }

  cambiarEditar(){
    this.editarCampos=!this.editarCampos
  }
}
