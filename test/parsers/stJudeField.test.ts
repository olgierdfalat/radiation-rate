import { StJudeField } from "../../src/parsers";

describe("StJude field parser", () => {
  const parser = new StJudeField();

  it("should parse string field by line", () => {
    const line = "100Programmer Marketing NameMerlin";
    const field = parser.getField(line);

    expect(field).toEqual({
      id: 100,
      name: "Programmer Marketing Name",
      type: "string",
      value: "Merlin"
    });
  });

  it("should parse field by line with no value", () => {
    const line = "2469RV Lead Serial Number";
    const field = parser.getField(line);

    expect(field).toEqual({
      id: 2469,
      name: "RV Lead Serial Number",
      type: "string",
      value: ""
    });
  });

  it("should throw exception when line doesn't contain at least three elements", () => {
    const line = "wrong line";
    expect(() => {
      parser.getField(line);
    }).toThrowError(
      'Line "wrong line", should contain at least three elements.'
    );
  });

  it("should parse number field by line", () => {
    const line = "2393VF Therapy No. Stimuli8";
    const field = parser.getField(line, 'number');

    expect(field).toEqual({
      id: 2393,
      name: "VF Therapy No. Stimuli",
      type: "number",
      value: 8
    });
  });

  it("should throw exception when numeric field value is not a number", () => {
    const line = "2393VF Therapy No. StimuliNotNumber";
    expect(() => {
      console.log("returned value:", parser.getField(line, "number"));
    }).toThrowError('Value: "NotNumber" inside "2393VF Therapy No. StimuliNotNumber" is not a number.');
  });

  it("should parse boolean field by line", () => {
    const line = "2902CommittedFalse";
    const field = parser.getField(line, 'boolean');

    expect(field).toEqual({
      id: 2902,
      name: 'Committed',
      type: 'boolean',
      value: false
    });
  });

});
