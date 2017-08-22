import initialState from './initialState.js';
import * as types from '../constants/actionTypes.js';
import R from 'ramda';

export default function editor(state = initialState.editor, action) {
  switch (action.type) {

  case types.RESIZE_PANE:
    return R.assoc('resizePane', new Date(), state);

  default:
    return state;
  }
}
