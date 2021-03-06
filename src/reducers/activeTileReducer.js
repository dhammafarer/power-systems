import initialState from './initialState.js';
import * as types from '../constants/actionTypes.js';

export default function activeTile (state = initialState.activeTile, action) {
  switch (action.type) {

  case types.SET_ACTIVE_TILE:
    return action.payload;

  case types.SAVE_TILE:
  case types.DELETE_TILE:
  case types.RESET_ACTIVE_TILE:
    return null;

  default:
    return state;
  }
}
