import tile from '../lib/tile.js';
import merge from 'ramda/src/merge';
import * as st from '../data/structure-textures.js';

// generators
export const generator = ({texture, position, data}) => {
  const d = merge({
    category: 'generator',
  }, data);
  return tile({texture, position, data: d});
};

export const diesel = ({position, data}) => {
  const texture = st.dieselGenerator;
  const d = merge({
    name: 'Diesel Generator',
    type: 'backup',
    tag: 'diesel',
    capacity: 0,
    base: 0.2,
    ramp: 0.05,
    max: 200
  }, data);
  return generator({texture, position, data: d});
};

export const gas = ({position, data}) => {
  const texture = st.gasEngine;
  const d = merge({
    name: 'Gas Generator',
    type: 'base',
    tag: 'gas',
    capacity: 0,
    base: 0.2,
    ramp: 0.05,
    max: 200
  }, data);
  return generator({texture, position, data: d});
};

export const solar = ({position, data}) => {
  const texture = st.pvSolar;
  const d = merge({
    name: 'PV Solar',
    type: 'variable',
    variation: 'solar',
    tag: 'solar',
    capacity: 0,
    max: 200,
  }, data);
  return generator({texture, position, data: d});
};

export const wind = ({position, data}) => {
  const texture = st.windGen;
  const d = merge({
    name: 'Wind Generator',
    type: 'variable',
    variation: 'solar',
    tag: 'wind',
    capacity: 0,
    max: 200
  }, data);
  return generator({texture, position, data: d});
};

// battery
export const battery = ({position, data}) => {
  const texture = st.batteryContainer;
  const d = merge({
    name: 'ESS',
    category: 'battery',
    type: 'battery',
    tag: 'battery',
    buffer: true,
    storage: false,
    capacity: 50,
    ramp: 0.1,
    c: 3,
    initSoc: 0.5,
    minSoc: 0.2
  }, data);
  return tile({texture, position, data: d});
};

// consumers
export const consumer = ({texture, position, data}) => {
  const d = merge({
    category: 'consumer',
    variation: 'defaultLoad',
    type: 'load',
    tag: 'load',
  }, data);
  return tile({texture, position, data: d});
};

export const houseThatched = ({position, data}) => {
  const texture = st.houseThatched;
  const d = merge({
    name: 'Thatched House',
    capacity: 0,
    max: 200
  }, data);
  return consumer({texture, position, data: d});
};

export const communityCenter = ({position, data}) => {
  const texture = st.communityCenter;
  const d = merge({
    name: 'Community Center',
    capacity: 0,
    max: 200
  }, data);
  return consumer({texture, position, data: d});
};

export const hospital = ({position, data}) => {
  const texture = st.hospital;
  const d = merge({
    name: 'Hospital',
    capacity: 0,
    max: 200
  }, data);
  return consumer({texture, position, data: d});
};

export const warehouse = ({position, data}) => {
  const texture = st.warehouse;
  const d = merge({
    name: 'Warehouse',
    capacity: 0,
    max: 200
  }, data);
  return consumer({texture, position, data: d});
};

export const schoolField = ({position, data}) => {
  const texture = st.schoolField;
  const d = merge({
    name: 'Warehouse',
    capacity: 0,
    max: 200
  }, data);
  return consumer({texture, position, data: d});
};

export const houseElevated = ({position, data}) => {
  const texture = st.houseElevated;
  const d = merge({
    name: 'House',
    capacity: 0,
    max: 200
  }, data);
  return consumer({texture, position, data: d});
};

export const distributor = ({texture, position, data}) => {
  const d = merge({
    category: 'distributor'
  }, data);
  return tile({texture, position, data: d});
};

export const powerPole = ({position, data}) => {
  const texture = st.powerPole;
  const d = merge({
    name: 'Microgrid Network',
  }, data);
  return distributor({texture, position, data: d});
};

// other
export const other = ({texture, position, data}) => {
  const d = merge({
    category: 'other'
  }, data);
  return tile({texture, position, data: d});
};

export const farm = ({position, data}) => {
  const texture = st.farm;
  const d = merge({
    name: 'Farm',
  }, data);
  return other({texture, position, data: d});
};

export const biomass = ({position, data}) => {
  const texture = st.biomass;
  const d = merge({
    name: 'Biomass',
  }, data);
  return other({texture, position, data: d});
};

export const boat = ({position, data}) => {
  const texture = st.boat;
  const d = merge({
    name: 'Farm',
  }, data);
  return other({texture, position, data: d});
};

export const terrain = ({texture, position, data}) => {
  const d = merge({
    category: 'terrain'
  }, data);
  return tile({texture, position, data: d});
};
