import initialState from './initialState.js';
import * as types from '../constants/actionTypes.js';
import { sortTiles } from '../lib/tile.js';
import over from 'ramda/src/over';
import set from 'ramda/src/set';
import compose from 'ramda/src/compose';
import lensPath from 'ramda/src/lensPath';
import lensIndex from 'ramda/src/lensIndex';
import map from 'ramda/src/map';
import assocPath from 'ramda/src/assocPath';
import append from 'ramda/src/append';
import not from 'ramda/src/not';
import remove from 'ramda/src/remove';
import path from 'ramda/src/path';
import lt from 'ramda/src/lt';
import where from 'ramda/src/where';
import equals from 'ramda/src/equals';
import __ from 'ramda/src/__';
import evolve from 'ramda/src/evolve';
import filter from 'ramda/src/filter';
import identity from 'ramda/src/identity';

// operation that sets the value of active field in the data object of an array of objects
const mapActive = compose(
  map,
  assocPath(['active'])
);

// update operation of all structure tile objects of a scene
const toggleSceneActiveState = (bool, state) =>
  over(
    lensPath(['structureTiles']),
    mapActive(bool)
  )(state);

// lens that focuses on the active field of data object inside a strtucture tile
const fieldLens = (tileIdx, field) =>
  compose(
    lensPath(['structureTiles']),
    lensIndex(tileIdx),
    lensPath([field])
  );

const toggleStructureActive = (action, state) =>
  over(fieldLens(action.payload, 'active'), not, state);

const toggleBuffer = (action, state) =>
  over(fieldLens(action.payload, 'buffer'), not, state);

const toggleStorage = (action, state) =>
  over(fieldLens(action.payload, 'storage'), not, state);

const saveTile = (action, state) => {
  const {type, tile} = action.payload;
  const idx = state[type].findIndex(t => t.position.equals(tile.position));
  if (idx < 0) {
    return over(
      lensPath([type]),
      compose(sortTiles, append(tile))
    )(state);
  } else {
    return set(
      compose(lensPath([type]), lensIndex(idx)),
      tile
    )(state);
  }
};

const deleteTile = (action, state) => {
  const {type, position} = action.payload;
  const idx = state[type].findIndex(t => t.position.equals(position));
  return (idx < 0) ? state : over(lensPath([type]), remove(idx, 1))(state);
};

const cropToGrid = (action, state) => {
  const spec = ([r, c]) => ({x: lt(__, r), y: lt(__, c)});
  const pred = arr => compose(where(spec(arr)), path(['position']));
  const fn = filter(pred(action.payload));
  return evolve({terrainTiles: fn, structureTiles: fn})(state);
};

const setStructureProperty = (fn, property) => (action, state) => {
  const {index, field} = action.payload;
  return set(
    compose(lensPath(['structureTiles']), lensIndex(index), lensPath([property])),
    fn(field)
  )(state);
};

const setStructureCapacity = setStructureProperty(parseFloat, 'capacity');
const setStructureRamp = setStructureProperty(parseFloat, 'ramp');
const setStructureBase = setStructureProperty(parseFloat, 'base');
const setStructureType = setStructureProperty(identity, 'type');
const setBatteryC = setStructureProperty(parseInt, 'c');

export default function activeScene (state = initialState.activeScene, action) {
  switch (action.type) {

  case types.SET_ACTIVE_SCENE:
  case types.SAVE_NEW_SCENE:
  case types.UPDATE_SCENE:
    return action.payload;

  case types.CLOSE_EDITOR:
    return state.id ? state : null;

  case types.SET_EMPTY_ACTIVE_SCENE:
    return action.payload;

  case types.SCENE_TOGGLE_POWER:
    return toggleSceneActiveState(action.payload, state);

  case types.TOGGLE_STRUCTURE_ACTIVE:
    return toggleStructureActive(action, state);

  case types.SET_SCENE_NAME:
    return assocPath(['name'], action.payload)(state);

  case types.ADJUST_GRID_SIZE:
    return assocPath(['gridSize'], action.payload)(state);

  case types.CROP_TO_GRID:
    return  cropToGrid(action, state);

  case types.SAVE_TILE:
    return saveTile(action, state);

  case types.DELETE_TILE:
    return deleteTile(action, state);

  case types.SET_STRUCTURE_CAPACITY:
    return setStructureCapacity(action, state);

  case types.SET_STRUCTURE_RAMP:
    return setStructureRamp(action, state);

  case types.SET_STRUCTURE_BASE:
    return setStructureBase(action, state);

  case types.SET_STRUCTURE_TYPE:
    return setStructureType(action, state);

  case types.SET_BATTERY_C:
    return setBatteryC(action, state);

  case types.SET_BATTERY_BUFFER:
    return toggleBuffer(action, state);

  case types.SET_BATTERY_STORAGE:
    return toggleStorage(action, state);

  default:
    return state;
  }
}
