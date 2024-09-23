export class DicomRoom {
  id: number;
  displayName: string;
  enabled: boolean;

  constructor(id: number, name: string, enable = true) {
    this.id = id;
    this.displayName = name;
    this.enabled = enable;
  }
}
