import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-landing-membresia',
  templateUrl: './landing-membresia.component.html',
  styleUrls: ['./landing-membresia.component.css'],
})
export class LandingMembresiaComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  nombreCliente:string = null;
  ngOnInit() {
    this.nombreCliente = this.route.snapshot.paramMap.get('nombreCliente')
    if(!this.nombreCliente){
      window.location.href='/'
    }
  }
}
