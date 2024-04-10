import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import SignaturePad from 'signature_pad';
import { ActivatedRoute, Router } from '@angular/router';
import { FirmaService } from 'src/app/services/firma-service.service';
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-firmar-membresia',
  templateUrl: './firmar-membresia.component.html',
  styleUrls: ['./firmar-membresia.component.css'],
})
export class FirmarMembresiaComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firmaService: FirmaService
  ) {}

  @ViewChild('signaturePad', { static: true }) signaturePadElement: ElementRef;
  model: Paciente = new Paciente();
  codigoMembresia: string = '';
  idURL: number = 0;
  private signaturePad: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idURL = parseInt(params.get('idPaciente'));
      this.model.nombreCompleto = params.get('nombrePaciente');
      this.codigoMembresia = params.get('codigoMembresia');
    });
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
    this.firmaService.guardarFirma(this.idURL,firma).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({ title: 'Firma guardada correctamente', icon: 'success' });
      },
      (error) => {
        console.log(error);
        Swal.fire({ title: 'Error al guardar la firma, intente despues', icon: 'warning' });
      }
    );
  }
}
