/* global describe, it, expect */
import { computeOutput } from '../../lib/power-data.js';
import R from 'ramda';

const powerData = {
  'defaultLoad':    [{value: 0.3}, {value: 0.7}, {value: 0.5}, {value: 0.3}],
  'solar' :         [{value: 0.0}, {value: 0.2}, {value: 0.6}, {value: 0.0}]
};

const dates = ["01:00", "02:00", "03:00", "04:00"];

describe('computeOutput', () => {
  describe('given data with battery', () => {
    const data = [
      {id: 'c1', category: 'consumer',  capacity:  100, type: 'load', variation: 'defaultLoad'},
      {id: 'c2', category: 'consumer',  capacity:  100, type: 'load', variation: 'defaultLoad'},
      {id: 'v1', category: 'generator', capacity:  100, type: 'variable', variation: 'solar'},
      {id: 'v2', category: 'generator', capacity:  100, type: 'variable', variation: 'solar'},
      {id: 'gb', category: 'generator', capacity:  100, type: 'base', ramp: 0.1, base: 0.3},
      {id: 'b1',  category: 'battery',  capacity:  100, type: 'battery', soc: 0.5, c: 3, buffer: true, ramp: 0.1, storage: true}
    ];

    const expected = {
      c1: [{date: "01:00", power: 30}, {date: "02:00", power:  70}, {date: "03:00", power:  50}, {date: "04:00", power:   30}],
      c2: [{date: "01:00", power: 30}, {date: "02:00", power:  70}, {date: "03:00", power:  50}, {date: "04:00", power:   30}],
      v1: [{date: "01:00", power:  0}, {date: "02:00", power:  20}, {date: "03:00", power:  60}, {date: "04:00", power:    0}],
      v2: [{date: "01:00", power:  0}, {date: "02:00", power:  20}, {date: "03:00", power:  60}, {date: "04:00", power:    0}],
      gb: [{date: "01:00", power: 60}, {date: "02:00", power:  70}, {date: "03:00", power:  60}, {date: "04:00", power:   50}],
      b1: [{date: "01:00", power:  0, buffer: 0, storage: 0},  {date: "02:00", power: 20, buffer: 20, storage: -50}, {date: "03:00", power: 40, buffer: 80, storage: 0}, {date: "04:00", power: 20, buffer: -20, storage: 10}]
    };

    it('computes power output for each component', () => {
      let res = computeOutput(powerData, dates,data);
      expect(res.length).toEqual(expected.length);
      expect(R.pluck('power', res.c1)).toEqual(R.pluck('power', expected.c1));
      expect(R.pluck('power', res.v1)).toEqual(R.pluck('power', expected.v1));
      expect(R.pluck('power', res.gb)).toEqual(R.pluck('power', expected.gb));
      expect(R.pluck('buffer', res.b1)).toEqual(R.pluck('buffer', expected.b1));
      expect(R.pluck('storage', res.b1)).toEqual(R.pluck('storage', expected.b1));
    });

    it.only('computes energy for each component and buffer', () => {
      const data = [
        {id: 'c1', category: 'consumer',  capacity:  100, type: 'load', variation: 'defaultLoad'},
        {id: 'v1', category: 'generator', capacity:  100, type: 'variable', variation: 'solar'},
        {id: 'base', category: 'generator', capacity:  100, type: 'base', ramp: 0.1, base: 0.3},
        {id: 'bat', category: 'battery',  capacity:  100, type: 'battery', soc: 0.5, c: 3, buffer: true, ramp: 0.1, storage: false}
      ];

      const expected = {
        v1:     {power: [ 0, 20, 60,  0], energy: [   0,  833, 3333, 2500]},
        bat:    {power: [ 0, 10, 20, 10], energy: [   0,  417, 1250, 1250], buffer: [0, 10, 40, -20], buffered: [0, 416, 2083, 1250], balance: [50000, 50416, 52499, 53749]},
        c1:     {power: [30, 70, 50, 30], energy: [2500, 4167, 5000, 3333]},
        base:     {power: [30, 40, 30, 30], energy: [2500, 2917, 2917, 2500]}
      };

      let res = computeOutput(powerData, dates,data);

      expect(res.length).toEqual(expected.length);

      expect(R.pluck('energy', res.c1)).toEqual(expected.c1.energy);
      expect(R.pluck('energy', res.v1)).toEqual(expected.v1.energy);
      expect(R.pluck('energy', res.base)).toEqual(expected.base.energy);
      expect(R.pluck('energy', res.bat)).toEqual(expected.bat.energy);
      expect(R.pluck('balance', res.bat)).toEqual(expected.bat.balance);
      expect(R.pluck('buffer', res.bat)).toEqual(expected.bat.buffer);
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

  describe('given data with backup', () => {
    const data = [
      {id: 'c1', category: 'consumer',  capacity: 200, type: 'load', variation: 'defaultLoad'},
      {id: 'base', category: 'generator', capacity: 100, type: 'base', ramp: 0.1, base: 0.3},
      {id: 'backup', category: 'generator', capacity: 100, type: 'backup', ramp: 0.1, base: 0.3},
    ];

    const expected = {
      c1:       [{date: "01:00", power: 60}, {date: "02:00", power:  140}, {date: "03:00", power:  100}, {date: "04:00", power:   60}],
      base:     [{date: "01:00", power: 60}, {date: "02:00", power:   70}, {date: "03:00", power:   80}, {date: "04:00", power:   70}],
      backup:   [{date: "01:00", power:  0}, {date: "02:00", power:   70}, {date: "03:00", power:   60}, {date: "04:00", power:   50}],
    };

    it('computes output for each component', () => {
      expect(computeOutput(powerData, dates, data)).toEqual(expected);
    });
  });

  describe('given data with power-grid', () => {
    const data = [
      {id: 'c1', category: 'consumer',  capacity: 200, type: 'load', variation: 'defaultLoad'},
      {id: 'base', category: 'generator', capacity: 100, type: 'base', ramp: 0.1, base: 0.3},
      {id: 'grid', category: 'grid', type: 'grid'},
      {id: 'backup', category: 'generator', capacity: 100, type: 'backup', ramp: 0.1, base: 0.3},
    ];

    const expected = {
      c1:     [{date: "01:00", power: 60}, {date: "02:00", power:  140}, {date: "03:00", power:  100}, {date: "04:00", power:   60}],
      base:   [{date: "01:00", power: 60}, {date: "02:00", power:   70}, {date: "03:00", power:   80}, {date: "04:00", power:   70}],
      grid:   [{date: "01:00", power:  0}, {date: "02:00", power:   70}, {date: "03:00", power:   20}, {date: "04:00", power:    0}],
      backup: [{date: "01:00", power:  0}, {date: "02:00", power:    0}, {date: "03:00", power:    0}, {date: "04:00", power:    0}]
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
});
