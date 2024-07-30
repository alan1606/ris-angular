import { CanDeactivateFn } from '@angular/router';
import Swal from 'sweetalert2';
import { DictadorComponent } from '../dictador/components/dictador/dictador.component';

export const ExitGuard: CanDeactivateFn<DictadorComponent> = async (
  component
) => {
  let ask = true;
  if (component.templateForm.dirty) {
    ask = await Swal.fire({
      icon: 'question',
      title: 'Si tienes cambios se perderan',
      text: '¿Seguro que desea salir?',
      showCancelButton: true,
      cancelButtonText: 'Seguir',
      cancelButtonColor: '#566573',
      confirmButtonText: 'Salir',
      confirmButtonColor: '#1A6EFA',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      }
      if (result.isDenied) {
        return false;
      } else {
        return false;
      }
    });
  }
  return ask;
};
