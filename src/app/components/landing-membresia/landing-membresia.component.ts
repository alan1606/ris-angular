import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-landing-membresia',
  templateUrl: './landing-membresia.component.html',
  styleUrls: ['./landing-membresia.component.css'],
})
export class LandingMembresiaComponent implements OnInit {
  constructor(private route: ActivatedRoute, private elementRef: ElementRef) {}
  nombreCliente: string = null;
  ngOnInit() {
    this.nombreCliente = this.route.snapshot.paramMap.get('nombreCliente');
    if (!this.nombreCliente) {
      window.location.href = '/';
    }
  }

  primerClick() {
    const finalElement = this.elementRef.nativeElement.querySelector('#adquirir');
    if (finalElement) {
      finalElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
