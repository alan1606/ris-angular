import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import SignaturePad from 'signature_pad';
import { FirmaService } from 'src/app/services/firma-service.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-firmar-membresia',
  templateUrl: './firmar-membresia.component.html',
  styleUrls: ['./firmar-membresia.component.css'],
})
export class FirmarMembresiaComponent implements OnInit, AfterViewInit {
  constructor(
    private firmaService: FirmaService,
    @Inject(MAT_DIALOG_DATA) private datos: any,
    private dialogRef: MatDialogRef<FirmarMembresiaComponent>
  ) {}

  @ViewChild('signaturePad', { static: true }) signaturePadElement: ElementRef;
  public model: Paciente = new Paciente();
  public codigoMembresia: string = '';
  private idURL: number = 0;
  private signaturePad: any;

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   if (params.get('idPaciente')) {
    //     this.idURL = parseInt(params.get('idPaciente'));
    //     this.model.nombreCompleto = params.get('nombrePaciente');
    //     this.codigoMembresia = params.get('codigoMembresia');
    //   }
    // });
    if (this.datos) {
      this.idURL = this.datos.model.id;
      this.model = this.datos.model;
      this.codigoMembresia = this.datos.codigoMembresia;
    } else {
      console.error(
        'Error al intentar firmar, ya que los datos no se encontraron'
      );
      this.dialogRef.close();
    }
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement.nativeElement
    );
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  saveSignature(): void {
    const firma = this.signaturePad.toDataURL();
    let firmabackend = {
      idPaciente: this.idURL,
      firma: firma,
    };
    this.firmaService.guardarFirma(firmabackend).subscribe(
      (data) => {
        Swal.fire({ title: 'Firma guardada correctamente', icon: 'success' });
        this.dialogRef.close(data);
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al guardar la firma, intente despues',
          icon: 'warning',
        });
      }
    );
  }

  salir(): void {
    this.dialogRef.close();
  }
}
