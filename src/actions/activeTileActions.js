import * as types from '../constants/actionTypes.js';

export function setActiveTile (position) {
  return {
    type: types.SET_ACTIVE_TILE,
    payload: position
  };
}
