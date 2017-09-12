/* global describe, it, expect */
import { computeOutput } from '../../lib/power-data.js';

const powerData = {
  'defaultLoad':    [0.3, 0.7, 0.5, 0.3],
  'solar' :         [0.0, 0.2, 0.6, 0.0]
};

const dates = ["01:00", "02:00", "03:00", "04:00"];

describe('computeOutput', () => {
  describe('given data with battery', () => {
    const data = [
      {id: 'c1', category: 'consumer',  capacity: 100, type: 'load', variation: 'defaultLoad'},
      {id: 'c2', category: 'consumer',  capacity: 100, type: 'load', variation: 'defaultLoad'},
      {id: 'v1', category: 'generator', capacity: 100, type: 'variable', variation: 'solar'},
      {id: 'v2', category: 'generator', capacity: 100, type: 'variable', variation: 'solar'},
      {id: 'gb', category: 'generator', capacity: 100, type: 'base', ramp: 0.1, base: 0.3},
      {id: 'b1',  category: 'battery', type: 'battery', buffer: true, ramp: 0.1, storage: true}
    ];

    const expected = {
      c1: [{date: "01:00", power: 30}, {date: "02:00", power:  70}, {date: "03:00", power:  50}, {date: "04:00", power:   30}],
      c2: [{date: "01:00", power: 30}, {date: "02:00", power:  70}, {date: "03:00", power:  50}, {date: "04:00", power:   30}],
      v1: [{date: "01:00", power:  0}, {date: "02:00", power:  20}, {date: "03:00", power:  60}, {date: "04:00", power:    0}],
      v2: [{date: "01:00", power:  0}, {date: "02:00", power:  20}, {date: "03:00", power:  60}, {date: "04:00", power:    0}],
      gb: [{date: "01:00", power: 60}, {date: "02:00", power:  70}, {date: "03:00", power:  60}, {date: "04:00", power:   50}],
      b1: [{date: "01:00", power:  0, buffer: 0, storage: 0},  {date: "02:00", power: 20, buffer: 20, storage: -50}, {date: "03:00", power: 40, buffer: 80, storage: 0}, {date: "04:00", power: 20, buffer: -20, storage: 10}]
    };

    it('computes output for each component', () => {
      expect(computeOutput(powerData, dates, data)).toEqual(expected);
    });
  });

  describe('given data without battery', () => {
    const data = [
      {id: 'c1', category: 'consumer',  capacity: 100, type: 'load', variation: 'defaultLoad'},
      {id: 'v1', category: 'generator', capacity: 100, type: 'variable', variation: 'solar'},
      {id: 'gb', category: 'generator', capacity: 100, type: 'base', ramp: 0.1, base: 0.4}
    ];

    const expected = {
      c1: [{date: "01:00", power: 30}, {date: "02:00", power:  70}, {date: "03:00", power:  50}, {date: "04:00", power:   30}],
      v1: [{date: "01:00", power:  0}, {date: "02:00", power:  20}, {date: "03:00", power:  60}, {date: "04:00", power:    0}],
      gb: [{date: "01:00", power: 40}, {date: "02:00", power:  50}, {date: "03:00", power:  40}, {date: "04:00", power:   40}]
    };

    it('computes output for each component', () => {
      expect(computeOutput(powerData, dates, data)).toEqual(expected);
    });
  });

  describe('given data without load', () => {
    const data = [
      {id: 'v1', category: 'generator', capacity: 100, type: 'variable', variation: 'solar'},
      {id: 'gb', category: 'generator', capacity: 100, type: 'base', ramp: 0.1, base: 0.4}
    ];

    const expected = {
      v1: [{date: "01:00", power:  0}, {date: "02:00", power:  20}, {date: "03:00", power:  60}, {date: "04:00", power:    0}],
      gb: [{date: "01:00", power: 40}, {date: "02:00", power:  40}, {date: "03:00", power:  40}, {date: "04:00", power:   40}]
    };

    it('computes output for each component', () => {
      expect(computeOutput(powerData, dates, data)).toEqual(expected);
    });
  });
});