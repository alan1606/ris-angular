import { Component } from '@angular/core';
import { CampaniaService } from 'src/app/campanias/services/campania.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-campania',
  templateUrl: './enviar-campania.component.html',
  styleUrls: ['./enviar-campania.component.css']
})
export class EnviarCampaniaComponent {

  lista:File = null;
  deshabilitado: boolean = false;
  descripcion: string = "";
  landing: string = "";
  baja: string = "";

  constructor(
    private campaniaService: CampaniaService
  ){}

  subirListaDeContactos(event: any){
    this.lista = event.target.files[0];
    if (
      this.lista.type.indexOf('officedocument') < 0 
    ) {
      Swal.fire('Error', 'Solamente puede seleccionar archivos de excel', 'error');
    }
  }

  enviar(){
    if(!this.datosValidos()){
      Swal.fire("Error", "Verifique los datos", "error");
      return;
    }
    this.deshabilitado = true;
    this.campaniaService.mandarCampaniaWhatsapp(this.descripcion, this.landing, this.baja, this.lista).subscribe(() =>{
      Swal.fire("Enviando", "Se están enviando los whatsapps", "success");
      this.deshabilitado = false;
    }, () =>{
      Swal.fire("Error", "Ha ocurrido un error", "error");
      this.deshabilitado = false;
    });
  }

  private datosValidos(): boolean{
    if(this.lista == null){
      return false;
    }
    if(!this.descripcion){
      return false;
    }
    if(!this.landing){
      return false;
    }
    if(!this.baja){
      return false;
    }
    return true;
  }
}
