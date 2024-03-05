import { Component, ElementRef, OnInit } from '@angular/core';
@Component({
  selector: 'app-landing-membresia',
  templateUrl: './landing-membresia.component.html',
  styleUrls: ['./landing-membresia.component.css'],
})
export class LandingMembresiaComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  primerClick() {
    const finalElement =
      this.elementRef.nativeElement.querySelector('#adquirir');
    if (finalElement) {
      finalElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  facebook() {
    window.open('https://www.facebook.com/GRUPODIAGNOCARE/', '_blank');
  }
  instagram() {
    window.open('https://www.instagram.com/grupodiagnocare/?hl=es', '_blank');
  }
  whatsapp() {
    window.open(
      'https://api.whatsapp.com/send/?phone=526271119421&text=Hola%2C+quiero+obtener+mi+membresia+...&type=phone_number&app_absent=0',
      '_blank'
    );
  }
  llamada() {
    window.location.href = 'tel:6275223484';
  }
}
