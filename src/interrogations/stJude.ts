import { Interrogation } from "./interrogation";

export class StJude extends Interrogation {
  async getData(): Promise<any> {
    return {
      id: 100,
      name: "Programmer Marketing Name",
      value: "Merlin",
      type: "string"
    };
  }
}