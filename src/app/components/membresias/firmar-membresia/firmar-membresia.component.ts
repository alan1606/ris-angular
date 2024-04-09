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

@Component({
  selector: 'app-firmar-membresia',
  templateUrl: './firmar-membresia.component.html',
  styleUrls: ['./firmar-membresia.component.css'],
})
export class FirmarMembresiaComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  @ViewChild('signaturePad', { static: true }) signaturePadElement: ElementRef;
  model: Paciente = new Paciente();
  codigoMembresia: string = '';
  idURL: string = '';
  private signaturePad: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idURL = params.get('idPaciente');
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
    const signatureDataUrl = this.signaturePad.toDataURL();
    console.log(signatureDataUrl);
  }
}
