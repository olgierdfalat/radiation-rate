import xpath from 'xpath';
import * as models from './../../models';
import { XmlParser } from '../xmlParser';
import { KeyValuePair } from './../../models';

const NR = 'NR';
const SERIAL_NUMBER_DATA = 'SERHSM[Table=TBU_DEFI_DATA]';
const SERIAL_NUMBER_DATEN = 'SERHSM[Table=TBU_HSM_DATEN]';

export class BiotronikData extends XmlParser {
  private episodes: models.FieldModel[][];

  constructor(content: string, filePath: string) {
    super(content, filePath);
  }

  protected parseXml() {
    super.parseXml();
    const select = xpath.useNamespaces({ 'bio': 'urn:biotronik' });
    const fileInformationSelector = '//Paceart/FileInformation';
    const icdSelector = '//Paceart/PatientRecords/PatientRecord/Devices/ICD';
    const icdDetailSelector = `${icdSelector}/ICDLookup/ICDDetail`;
    const icdClinicSelector = '//Paceart/PatientRecords/PatientRecord/Tests/ICDClinic';
    const demographicsSelector = '//Paceart/PatientRecords/PatientRecord/Demographics';
    const schemaVersion = select(`string(${fileInformationSelector}/@SchemaVersion)`, this.xmlDoc);
    const institutionName = select(`string(${fileInformationSelector}/@InstitutionName)`, this.xmlDoc);
    const generationDate = select(`string(${fileInformationSelector}/@GenerationDate)`, this.xmlDoc);
    const nameLast = select(`string(${demographicsSelector}/@nameLast)`, this.xmlDoc);
    const nameFirst = select(`string(${demographicsSelector}/@nameFirst)`, this.xmlDoc);
    const birthDate = select(`string(${demographicsSelector}/@BirthDate)`, this.xmlDoc);
    const commentary = select(`string(${demographicsSelector}/@Commentary)`, this.xmlDoc);
    const serialNumber = select(`string(${icdSelector}/@SerialNumber)`, this.xmlDoc);
    const manufacturer = select(`string(${icdDetailSelector}/@Manufacturer)`, this.xmlDoc);
    const model = select(`string(${icdDetailSelector}/@Model)`, this.xmlDoc);
    const implantDate = select(`string(${icdSelector}/ImplantInformation/@Date)`, this.xmlDoc);
    const icdClinicDate = select(`string(${icdClinicSelector}/@Date)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_PacingMode = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@PacingMode)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_LowerRate_bpm = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@LowerRate_bpm)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_HysteresisRate_bpm = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@HysteresisRate_bpm)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_TrackingRate_bpm = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@TrackingRate_bpm)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_PMTIntervention = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@PMTIntervention)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_PVCIntervention = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@PVCIntervention)`, this.xmlDoc);
    const icdClinicEvaluationBradyProgramming_Notes = select(`string(${icdClinicSelector}/Evaluation/BradyProgramming/@Notes)`, this.xmlDoc);


    this.data = {
      schemaVersion,
      institutionName,
      generationDate,
      nameLast,
      nameFirst,
      birthDate,
      commentary,
      serialNumber,
      manufacturer,
      model,
      implantDate,
      icdClinicDate,
      icdClinicEvaluationBradyProgramming_PacingMode,
      icdClinicEvaluationBradyProgramming_LowerRate_bpm,
      icdClinicEvaluationBradyProgramming_HysteresisRate_bpm,
      icdClinicEvaluationBradyProgramming_TrackingRate_bpm,
      icdClinicEvaluationBradyProgramming_PMTIntervention,
      icdClinicEvaluationBradyProgramming_PVCIntervention,
      icdClinicEvaluationBradyProgramming_Notes
    };
    const sensing = select(`${icdClinicSelector}/Evaluation/BradyProgramming/Sensing`, this.xmlDoc);
    sensing.forEach(s => {
      const node = s as Node;
      const chamberSymbol = select('string(@Chamber)', node);
      const amplitude_millivolts = select('string(@Amplitude_millivolts)', node);
      const polarity = select('string(@Polarity)', node);
      const blankingPeriod_ms = select('string(@BlankingPeriod_ms)', node);

      const sensingChamber = `icdClinicEvaluationBradyProgramming_Sensing_Chamber_${chamberSymbol}`;
      const sensingChamberAmplitude_millivolts = `icdClinicEvaluationBradyProgramming_Sensing_Chamber_${chamberSymbol}_Amplitude_millivolts`;
      const sensingChamberPolarity = `icdClinicEvaluationBradyProgramming_Sensing_Chamber_${chamberSymbol}_Polarity`;
      const sensingChamberBlankingPeriod_ms = `icdClinicEvaluationBradyProgramming_Sensing_Chamber_${chamberSymbol}_BlankingPeriod_ms`;

      this.data[sensingChamber] = chamberSymbol;
      this.data[sensingChamberAmplitude_millivolts] = amplitude_millivolts;

      if (polarity && polarity.length > 0) {
        this.data[sensingChamberPolarity] = polarity;
      }
      if (blankingPeriod_ms && blankingPeriod_ms.length > 0) {
        this.data[sensingChamberBlankingPeriod_ms] = blankingPeriod_ms;
      }
    });

    const pacing = select(`${icdClinicSelector}/Evaluation/BradyProgramming/Pacing`, this.xmlDoc);
    pacing.forEach(p => {
      const node = p as Node;
      const chamberSymbol = select('string(@Chamber)', node);
      const amplitude_volts = select('string(@Amplitude_volts)', node);
      const pulseWidth_ms = select('string(@PulseWidth_ms)', node);
      const polarity = select('string(@Polarity)', node);

      const pacingChamber = `icdClinicEvaluationBradyProgramming_Pacing_Chamber_${chamberSymbol}`;
      const pacingChamberAmplitude_volts = `icdClinicEvaluationBradyProgramming_Pacing_Chamber_${chamberSymbol}_Amplitude_volts`;
      const pacingChamberPulseWidth_ms = `icdClinicEvaluationBradyProgramming_Pacing_Chamber_${chamberSymbol}_PulseWidth_ms`;
      const pacingChamberPolarity = `icdClinicEvaluationBradyProgramming_Pacing_Chamber_${chamberSymbol}_Polarity`;

      this.data[pacingChamber] = chamberSymbol;
      this.data[pacingChamberAmplitude_volts] = amplitude_volts;
      this.data[pacingChamberPulseWidth_ms] = pulseWidth_ms;
      this.data[pacingChamberPolarity] = polarity;
    });

    const avDelaySelect = select(`${icdClinicSelector}/Evaluation/BradyProgramming/AVDelay`, this.xmlDoc);
    if (avDelaySelect.length > 0) {  
      const avDelay = avDelaySelect[0] as Node;

      this.readNodeWithAttributes(avDelay, 'icdClinicEvaluationBradyProgramming').forEach(x => {
        this.data[x.key] = x.value;
      });
    }
    const amsSelect = select(`${icdClinicSelector}/Evaluation/BradyProgramming/AMS`, this.xmlDoc);
    if (amsSelect.length > 0) {  
      const ams = amsSelect[0] as Node;
      this.readNodeWithAttributes(ams, 'icdClinicEvaluationBradyProgramming').forEach(x => {
        this.data[x.key] = x.value;
      });
    }
    const icdTelemetrySelect = select(`${icdClinicSelector}/Evaluation/ICDTelemetry`, this.xmlDoc);
    if(icdTelemetrySelect.length > 0) {
      const icdTelemetry = icdTelemetrySelect[0] as Node;
      this.readNodeWithAttributes(icdTelemetry, 'icdClinicEvaluation').forEach(x => {
        this.data[x.key] = x.value;
      });
    }
  }
  private readNode(selector: string) {
    /*
    const avDelaySelect = select(`${icdClinicSelector}/Evaluation/BradyProgramming/AVDelay`, this.xmlDoc);
    if (avDelaySelect.length > 0) {  
      const avDelay = avDelaySelect[0] as Node;

      this.readNodeWithAttributes(avDelay, 'icdClinicEvaluationBradyProgramming').forEach(x => {
        this.data[x.key] = x.value;
      });
    }
    */   
  }
  private readNodeWithAttributes(node: Node, prefix: string): KeyValuePair[] {
    const attributes: KeyValuePair[] = [];
    const name = node.nodeName;    
    const element = node as Element;

    if(element) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        attributes.push({key: `${prefix}_${name}_${attribute.name}`, value: attribute.value});        
      }        
    }
    return attributes;
  }

  getRow() {
    return this.data;
  }

  getExtraWorksheetRows(index = 0): models.WorksheetRow[] {
    if (index === 0) {
      return this.episodes.map(episode => {
        return episode.map(field => {
          return {
            name: field.name,
            type: field.type,
            value: field.value
          };
        });
      });
    }
    return undefined;
  }

  getDeviceId(): string {
    const serialField = this.data[SERIAL_NUMBER_DATA] || this.data[SERIAL_NUMBER_DATEN];
    if (serialField) {
      return serialField.value;
    }
    return 'Unknown device id';
  }

  getWorksheetRow(): models.WorksheetRow {
    const worksheetRow: models.WorksheetRow = [];
    for (const key in this.data) {
      if (key !== 'episodes') {
        worksheetRow.push(this.data[key] as models.WorksheetField);
      }
    }
    return worksheetRow;
  }
}