import { CanDeactivateFn } from '@angular/router';
import Swal from 'sweetalert2';
export const ExitGuard: CanDeactivateFn<unknown> = async (component, currentRoute, currentState, nextState) => {
  const ask:boolean = await Swal.fire({
    icon:"question",
    title:"Si tienes cambios se perderan",
    text:"¿Seguro que desea salir?",
    showCancelButton:true,
    cancelButtonText:"Seguir",
    cancelButtonColor:"#566573",
    confirmButtonText:"Salir",
    confirmButtonColor:"#1A6EFA",
    reverseButtons:true
  }).then((result)=>{
    if(result.isConfirmed){
      return true;
    }
    if(result.isDenied){
      return false
    }
    else{
      return false
    }
  })
  return ask
};
