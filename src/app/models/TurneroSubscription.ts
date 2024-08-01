import { EquipoDicom } from './equipo-dicom';

export class TurneroSubscription {
  id: number;
  user: string;
  dicomRoomId: number;
  room: EquipoDicom;
}
