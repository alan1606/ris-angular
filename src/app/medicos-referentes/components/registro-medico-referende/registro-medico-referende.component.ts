import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registro-medico-referende',
  templateUrl: './registro-medico-referende.component.html',
  styleUrls: ['./registro-medico-referende.component.css']
})
export class RegistroMedicoReferendeComponent {

  form:FormGroup = new FormGroup({
    Usuario: new FormControl(""),
    Password: new FormControl(""),
    ConfirmPassword: new FormControl(""),
    Telefono: new FormControl(""),
    Direccion: new FormControl("")
  });


  registrarUsuario(){
    console.log(this.form.value);
  }

  mostraUsuario(e){
    console.log(e);
  }
}
