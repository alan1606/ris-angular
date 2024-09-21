export class DicomRoom {
  id: number;
  displayName: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.displayName = name;
  }
}
