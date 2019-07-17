import {InterrogationsFactory} from './../../src/interrogations/interrogationsFactory';

describe('interrogations factory class', () => {
  it('should throw exception for unknown device', () => {
    const factory = new InterrogationsFactory();
    expect(() => {
      factory.getDataProvider('unknown');
    }).toThrow('No data provider for "unknown".');
  });

  it('should return StJude data provider', () => {
    const factory = new InterrogationsFactory();
    expect(factory.getDataProvider('StJude').constructor.name).toBe('StJudeInterrogationsDataProvider');
  });
});
