import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarResultadosComponent } from './enviar-resultados.component';

describe('EnviarResultadosComponent', () => {
  let component: EnviarResultadosComponent;
  let fixture: ComponentFixture<EnviarResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarResultadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
