import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Antecedente } from 'src/app/models/antecedente';
import { AntecedenteConcepto } from 'src/app/models/antecedente-concepto';
import { AntecedenteEstudio } from 'src/app/models/antecedente-estudio';
import { VentaConceptos } from 'src/app/models/venta-conceptos';
import { AntecedenteConceptoService } from 'src/app/services/antecedente-concepto.service';
import { AntecedenteEstudioService } from 'src/app/services/antecedente-estudio.service';
import { AntecedenteService } from 'src/app/services/antecedente.service';

@Component({
  selector: 'app-antecedentes-estudio-modal',
  templateUrl: './antecedentes-estudio-modal.component.html',
  styleUrls: ['./antecedentes-estudio-modal.component.css']
})
export class AntecedentesEstudioModalComponent implements OnInit {

  titulo : string;
  estudio: VentaConceptos;
  antecedentes : Antecedente[] = [];
  mostrarColumnasAgenda = ['hora', 'estudio', 'paciente', 'institucion'];
  todosSeleccionados = new Map();
  anteriores: Antecedente[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public modalRef: MatDialogRef<AntecedentesEstudioModalComponent>,
  private antecedenteEstudioService: AntecedenteEstudioService,
  private antecedenteService: AntecedenteService) { 
    this.estudio = this.data.estudio as VentaConceptos;
  }

  ngOnInit(): void {
    this.encontrarAntecedentesConcepto();
    this.titulo = `Antecedentes de ${this.estudio.paciente.nombreCompleto}`;
    this.antecedenteEstudioService.filtrarPorVentaConceptosId(this.estudio.id).subscribe(
      antecedentes => {
        this.anteriores = antecedentes.map(a => a.antecedente);
        console.log(this.anteriores);
      });
    this.seleccionarAnteriores();
  }

  seleccionarAnteriores() {

    this.antecedentes.forEach(antecedente =>{
      if(this.anteriores.includes(antecedente)){
        antecedente.seleccionado = true;
      }

      antecedente.hijos.forEach( hijo =>{
        if(this.anteriores.includes(hijo)){
          hijo.seleccionado = true;
        }
      });
    });
  }

  encontrarAntecedentesConcepto() {
    this.antecedenteService.encontrarPorConceptoId(this.estudio.concepto.id).subscribe(antecedentes =>{
      this.antecedentes = antecedentes.filter(a => !a.padre)
    });
    this.antecedentes.forEach(antecedentePadre =>{
      this.todosSeleccionados.set(antecedentePadre.id, false);
    });
    console.log(this.antecedentes);
  }


  cancelar(){
    this.modalRef.close();
  }

  ponerTodos(completar: boolean, antecedente: Antecedente) {
    antecedente.seleccionado = completar;
    if (antecedente.hijos == null) {
      return;
    }
    antecedente.hijos.forEach(hijo => (hijo.seleccionado = completar));
  }

  algunosCompletos(antecedente: Antecedente): boolean {
    if (antecedente.hijos == null) {
      return false;
    }
    return antecedente.hijos.filter(h => h.seleccionado).length > 0 && !this.todosSeleccionados.get(antecedente.id);
  }

  todosCompletos(antecedente: Antecedente): boolean{
    antecedente.hijos.filter(antecedente => {
      !antecedente.seleccionado
      return false;
    });
    return true;
  }

  actualizarTodosCompletos(antecedente: Antecedente){
      antecedente.seleccionado = antecedente.hijos?.filter(h => h.seleccionado).length > 0
      this.todosSeleccionados.set(antecedente.id, antecedente.hijos != null && antecedente.hijos.every(h => h.seleccionado));
  }


  guardar(){
    let antecedentesEstudios: AntecedenteEstudio[] = [];
    let antecedenteEstudio: AntecedenteEstudio;

    this.antecedentes.forEach(antecedente =>{
      if(antecedente.seleccionado){
        antecedenteEstudio = new AntecedenteEstudio();
         antecedenteEstudio.antecedente = antecedente;
         antecedenteEstudio.ventaConcepto = this.estudio;
         antecedentesEstudios.push(antecedenteEstudio);
      }
      antecedente.hijos.forEach(hijo =>{
        if(hijo.seleccionado){
          antecedenteEstudio = new AntecedenteEstudio()
          antecedenteEstudio.antecedente = hijo;
          antecedenteEstudio.ventaConcepto = this.estudio;
          antecedentesEstudios.push(antecedenteEstudio);
        }
      })
    });

    console.log("Antes de enviar");
    antecedentesEstudios.forEach(antecedente => {
      console.log(antecedente);
    });

    console.log("recibido");
    this.antecedenteEstudioService.crearTodos(antecedentesEstudios).subscribe(
      respuesta => {
        console.log(respuesta);
      });
  }
}
