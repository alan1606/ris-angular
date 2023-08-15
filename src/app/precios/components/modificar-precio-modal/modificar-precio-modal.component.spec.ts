import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPrecioModalComponent } from './modificar-precio-modal.component';

describe('ModificarPrecioModalComponent', () => {
  let component: ModificarPrecioModalComponent;
  let fixture: ComponentFixture<ModificarPrecioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarPrecioModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPrecioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
