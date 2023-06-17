import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Campania } from '../../models/campania';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaniaService } from '../../services/campania.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-campania',
  templateUrl: './crear-campania.component.html',
  styleUrls: ['./crear-campania.component.css']
})
export class CrearCampaniaComponent implements OnInit {

  titulo = "Crear campaña";
  campania: Campania;
  error: any;

  fechaInicioControl = new FormControl();
  fechaFinControl = new FormControl();

  constructor(
    private service: CampaniaService,
    private pipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(campania =>this.campania = campania)
      }
    });
  }


  editar(): void{
    if(!this.datosValidos()){
      return;
    }
    this.service.editar(this.campania).subscribe(concepto =>{
      console.log(concepto);
      Swal.fire('Modificado: ' , `Campaña actualizada con éxito`, "success");
      //this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });

  }

  crear(): void{
    if(!this.datosValidos()){
      return;
    }
    this.service.crear(this.campania).subscribe(model =>{
          console.log(model);
          Swal.fire('Nuevo:' , `Campaña creada con éxito`, 'success');
          //this.router.navigate([this.redirect]);
        }, err => {
          if(err.status === 400){
            this.error = err.error;
            console.log(this.error);
          }
        });

  }


  datosValidos(): boolean {
    if(this.campania.nombre == ''){
      return false;
    }
    if(this.campania.fechaInicio == ''){
      return false;
    }
    if(this.campania.fechaFin == ''){
      return false;
    }
    if(this.campania.codigo == ''){
      return false;
    }
    if(this.campania.descripcion == ''){
      return false;
    }
    return true;
  }

  seleccionarFechaInicio(fecha: HTMLInputElement): void {
    const fechaFormulario = this.pipe.transform(new Date(fecha.value), 'dd-MM-yyyy');
    this.campania.fechaInicio = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  }

  seleccionarFechaFin(fecha: HTMLInputElement): void {
    const fechaFormulario = this.pipe.transform(new Date(fecha.value), 'dd-MM-yyyy');
    this.campania.fechaFin = this.pipe.transform(new Date(fecha.value), 'yyyy-MM-dd');
  }
}
