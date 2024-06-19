import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { SendStudyToAeService } from '../../../services/send-study-to-ae.service';
import { DicomNodesService } from 'src/app/services/dicom-nodes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-estudio-dicom',
  templateUrl: './enviar-estudio-dicom.component.html',
  styleUrls: ['./enviar-estudio-dicom.component.css']
})
export class EnviarEstudioDicomComponent implements OnInit{

  estudio: VentaConceptos;
  aeTitles: string[] = ['a','b'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sendStudyService: SendStudyToAeService,
    private nodeService: DicomNodesService, 
    public modalRef: MatDialogRef<EnviarEstudioDicomComponent>) {
      this.estudio = this.data.estudio as VentaConceptos;
  }

  ngOnInit(): void {
    this.nodeService.buscarNodos().subscribe(nodos => this.aeTitles = nodos, ()=> console.error("Error cargando los nodos") );
  }

  seleccionarAeTitle(event){
    const ae = event.value as string;
    Swal.fire({
      title: `¿Enviar a ${ae}?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendStudyService.enviarEstudioAAe(this.estudio.iuid, ae).subscribe(response =>{
          console.info(response);
          Swal.fire('Enviado', 'Se está enviando el estudio', 'success')
          this.modalRef.close();
        }, error =>{
          Swal.fire('Error', 'Ha ocurrido un error ' + error, 'error')
        });
      } else if (result.isDenied) {
        Swal.fire('Ah bueno, selecciona otro pues', '', 'info')
      }
    })
  }

}
