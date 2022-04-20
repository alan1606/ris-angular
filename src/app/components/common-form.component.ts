import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

@Component({
  template: ''
})

export abstract class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string;
  model: E;
  error: any;

  protected redirect: string;
  protected nombreModel: string;


  constructor(@Inject(CommonService) protected  service : S, 
              protected  router: Router,
              protected  route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if(id){
        this.service.ver(id).subscribe(model =>this.model = model)
      }
    });
  }

  public crear() : void{
    this.service.crear(this.model).subscribe(model =>{
      console.log(model);
      Swal.fire('Nuevo:' , `${this.nombreModel} creado con éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar() : void{
    this.service.editar(this.model).subscribe(concepto =>{
      console.log(concepto);
      Swal.fire('Modificado: ' , `${this.nombreModel} actualizado con éxito`, "success");
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }


  

}
