import { Generic } from "./generic";
import { PatientId } from "./patient-id";
import { PersonName } from "./person-name";

export class Patient implements Generic{

    id: number;
    createdTime: string;
    numStudies: number;
    patCustom: string;
    sex: string;
    patientId: PatientId;
    personName: PersonName;

}
