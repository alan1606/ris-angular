import { Generic } from "./generic";
import { Patient } from "./patient";

export class Study implements Generic{

    id: number;
    accessionNo: string;
    createdTime: string;
    studyDesc: string;
    studyId: string;
    studyIuid: string;
    patient: Patient;

}
