import { combineReducers } from 'redux';
import autocomplete from '../src/reducer';

function app(state = {}, action) {
  switch (action.type) {
  default:
    return state;
  }
}

export default combineReducers(
  { app, autocomplete }
);
