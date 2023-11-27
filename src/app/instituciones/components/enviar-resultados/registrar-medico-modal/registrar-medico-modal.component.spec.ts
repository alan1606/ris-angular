import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMedicoModalComponent } from './registrar-medico-modal.component';

describe('RegistrarMedicoModalComponent', () => {
  let component: RegistrarMedicoModalComponent;
  let fixture: ComponentFixture<RegistrarMedicoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarMedicoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarMedicoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
