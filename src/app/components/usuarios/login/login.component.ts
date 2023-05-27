import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  ocultar = true;
  titulo= 'Inicie sesión';
  usuario: Usuario;

  constructor(private router: Router,
              private authService: AuthService) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    /*if(this.authService.isAuthenticated()){
      this.router.navigate(['/venta-conceptos']);
      Swal.fire('Login', 'Ya estás autenticado', 'info');
    }*/
  }



  /*

  login(): void{
    console.log(this.usuario.username);
    console.log(this.usuario.password);

    if(!this.hayDatosLogin()){
      Swal.fire('Error Login', 'Usuario o contraseña vacías', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(response =>{
      this.router.navigate(['/venta-conceptos']);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      console.log(usuario);
      Swal.fire('Bienvenido', `Hola ${usuario.username}, has iniciado sesión con éxito`, 'success');
    },
    e => {
      if(e.status == 400){
        Swal.fire('Error Login', 'Usuario o contraseña incorrecta', 'error');
      }
    });
  }

  hayDatosLogin(): boolean{
    if(this.usuario.username == null){
      return false;
    }
    if(this.usuario.password == null){
      return false;
    }
    return true;
  }
*/
}
