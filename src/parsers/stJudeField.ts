
export class StJudeField {
  getField(line: string, name: string) {
    let id = '';
    let value: string = null;
    let type: string = 'string';
    for (let i = 0; i < line.length; i++) {
      let charAt = line.charAt(i);
      if(isDigitCode(charAt.charCodeAt(0))) {
        id += charAt;
      }
      else {
        value = line.replace(id, '').replace(name, '');
        break;
      }
    }
    return {
      id: parseInt(id),
      name,
      type,
      value      
    };
  }
}

let charCodeZero = '0'.charCodeAt(0);
let charCodeNine = '9'.charCodeAt(0);

function isDigitCode(n: number): boolean {
   return(n >= charCodeZero && n <= charCodeNine);
}