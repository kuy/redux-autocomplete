import { createAction } from 'redux-actions';

const prefix = (name) => `redux-autocomplete/${name}`;

export const CHANGE_TEXT = prefix('CHANGE_TEXT');
export const changeText = createAction(CHANGE_TEXT);

export const OPEN_LIST = prefix('OPEN_LIST');
export const CLOSE_LIST = prefix('CLOSE_LIST');
export const openList = createAction(OPEN_LIST);
export const closeList = createAction(CLOSE_LIST);

export const SELECT_ITEM = prefix('SELECT_ITEM');
export const selectItem = createAction(SELECT_ITEM);

export const SET_HIGHLIGHT = prefix('SET_HIGHLIGHT');
export const CLEAR_HIGHLIGHT = prefix('CLEAR_HIGHLIGHT');
export const setHighlight = createAction(SET_HIGHLIGHT);
export const clearHighlight = createAction(CLEAR_HIGHLIGHT);
