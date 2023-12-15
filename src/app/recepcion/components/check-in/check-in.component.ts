import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';
import {  Router } from '@angular/router';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { PacientesService } from 'src/app/services/pacientes.service';
import { VentaConceptosService } from 'src/app/services/venta-conceptos.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css'],
})
export class CheckInComponent implements OnInit {
  constructor(private pacientesService:PacientesService, private router:Router, private ventaConceptosService:VentaConceptosService) {}


  nombrePaciente = new FormControl('');
  orden:number=null;
  ventaConceptos: VentaConceptos[] = null;
  // pacientes=[{"id":0,"Nombre":"juan","conceptos":{"MedicoReferente":"dr juan","conceptos":"torax ap"}},{"id":1,"Nombre":"emmanuel","conceptos":{"MedicoReferente":"dr juan","conceptos":"torax ap"}},{"id":2,"Nombre":"alan","conceptos":{"MedicoReferente":"dr juan","conceptos":"torax ap"}}]
  pacientes;
  ngOnInit(): void {
  }

  verOrden(idPaciente:number){
    this.router.navigate([`/recepcion/checkin/ver/${idPaciente}`])
  }

  buscarPacienteOrdenHoy() {
    this.ventaConceptosService.encontrarPorOrdenVentaId(30717).subscribe(
      (orden)=>{
        this.pacientes= orden
        console.log(this.pacientes)
      }
    );
  }
  displayFn(objeto: any): string {
    return objeto && objeto.Nombre ? objeto.Nombre : '';
  }
}
