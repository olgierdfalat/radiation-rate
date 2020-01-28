# radiation-rate

## Prerequisite
In order to run application we need NodeJS version 12.6.0 and have **Interrogacje** folder with log files on Desktop

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
nvm install 12.6.0
```
## Installation

```
nvm use
npm install
```

## Building 

```
npm run build
```

## Testing

```
npm test
```
or specific test
```
npm test -- -t "should return StJude data provider"
```

## Command line interface(CLI)

List of all available options
``` 
npm start -- -h
```

Generate Excel files for specific device type

```
npm start -- -x StJude
npm start -- -x Biotronik
npm start -- -x BiotronikStd
npm start -- -x BiotronikIEEE
npm start -- -x Medtronic
```

Generate checksum report for specific device type

```
npm start -- -c StJude
npm start -- -c Biotronik
npm start -- -c BiotronikStd
npm start -- -c BiotronikIEEE
npm start -- -c Medtronic
```

Generate list of included log files for specific device

```
npm start -- -i StJude
npm start -- -i Biotronik
npm start -- -i BiotronikStd
npm start -- -i BiotronikIEEE
npm start -- -i Medtronic
```

Generate list of excluded log files for specific device

```
npm start -- -e StJude
npm start -- -e Biotronik
npm start -- -e BiotronikStd
npm start -- -e BiotronikIEEE
npm start -- -e Medtronic
```

Generate list of wrong log files for specific device

```
npm start -- -w StJude
npm start -- -w Biotronik
npm start -- -w BiotronikStd
npm start -- -w BiotronikIEEE
npm start -- -w Medtronic
```