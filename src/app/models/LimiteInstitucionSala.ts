import { EquipoDicom } from './equipo-dicom';
import { Institucion } from './institucion';

export class LimiteInstitucionSala {
  id: number;
  institucion: Institucion;
  sala: EquipoDicom;
  limiteDiario: number;
  activo: boolean;
}
