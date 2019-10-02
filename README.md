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
npm start -- -x BiotronikStd
```

Generate checksum report for specific device type

```
npm start -- -c StJude
npm start -- -c BiotronikStd
```

Generate list of included log files for specific device

```
npm start -- -i StJude
npm start -- -i BiotronikStd
```

Generate list of excluded log files for specific device

```
npm start -- -e StJude
npm start -- -e BiotronikStd
```

Generate list of wrong log files for specific device

```
npm start -- -w StJude
npm start -- -w BiotronikStd
```