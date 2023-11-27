import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  ActivatedRoute } from '@angular/router';
import { RegistrarMedicoModalComponent } from './registrar-medico-modal/registrar-medico-modal.component';

@Component({
  selector: 'app-enviar-resultados',
  templateUrl: './enviar-resultados.component.html',
  styleUrls: ['./enviar-resultados.component.css']
})
export class EnviarResultadosComponent implements OnInit {
  
  
  constructor(
    private router:ActivatedRoute,
    private dialog:MatDialog,
    ) { }
  ordenId = this.router.snapshot.paramMap.get('ordenId');
  Medico=this.ordenId;
  ngOnInit(): void {
    if(this.Medico==""){
      this.abrirModalRegistrarMedico()
    }
    
  
  }

  abrirModalRegistrarMedico():void{
    const modalRef=this.dialog.open(RegistrarMedicoModalComponent,
      {
        width: "800px",
        
      });

      modalRef.afterClosed().subscribe(model =>{

      });
  }
}
