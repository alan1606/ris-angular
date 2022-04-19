import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Concepto } from 'src/app/models/concepto';
import { ConceptosService } from 'src/app/services/conceptos.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-conceptos-form',
  templateUrl: './conceptos-form.component.html',
  styleUrls: ['./conceptos-form.component.css']
})
export class ConceptosFormComponent implements OnInit {

  titulo = "Crear conceptos";

  concepto: Concepto = new Concepto();

  error: any;

  constructor(private service : ConceptosService, 
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(concepto =>this.concepto = concepto)
      }
    });
  }

  public crear() : void{
    this.service.crear(this.concepto).subscribe(concepto =>{
      console.log(concepto);
      Swal.fire('Nuevo:' , `Concepto ${concepto.concepto} creado con éxito`, 'success');
      this.router.navigate(['/conceptos']);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar() : void{
    this.service.editar(this.concepto).subscribe(concepto =>{
      console.log(concepto);
      Swal.fire('Modificado: ' , `Concepto ${concepto.concepto} actualizado con éxito`, "success");
      this.router.navigate(['/conceptos']);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }


  

}
