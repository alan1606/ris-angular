export class DicomRoom {
  id: number;
  displayName: string;
  enable: boolean;

  constructor(id, name) {
    this.id = id;
    this.displayName = name;
  }
}
