import * as types from '../constants/actionTypes.js';

export function setActiveScene (scene) {
  return {
    type: types.SET_ACTIVE_SCENE,
    scene
  };
}

export function sceneTogglePower (bool) {
  return {
    type: types.SCENE_TOGGLE_POWER,
    value: bool
  };
}
