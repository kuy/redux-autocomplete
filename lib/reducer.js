'use strict';

var _handlers;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _actions = require('./actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initial = {
  text: 'Ma',
  isOpen: false,
  highlightedIndex: null,
  items: []
};

function getViewItems(text, fn) {
  var getItems = fn.getItems;
  var shouldItemRender = fn.shouldItemRender;
  var sortItems = fn.sortItems;

  var items = getItems();
  if (shouldItemRender) {
    items = items.filter(function (item) {
      return shouldItemRender(item, text);
    });
  }
  if (sortItems) {
    items.sort(function (a, b) {
      return sortItems(a, b, text);
    });
  }
  return items;
}

var handlers = (_handlers = {}, _defineProperty(_handlers, _actions.CHANGE_TEXT, function (state, action) {
  var _action$payload = action.payload;
  var text = _action$payload.text;
  var fn = _action$payload.fn;

  return _extends({}, state, { text: text, items: getViewItems(text, fn) });
}), _defineProperty(_handlers, _actions.OPEN_LIST, function (state, action) {
  var text = state.text;
  var fn = action.payload.fn;

  return _extends({}, state, { isOpen: true, highlightedIndex: null, items: getViewItems(text, fn) });
}), _defineProperty(_handlers, _actions.CLOSE_LIST, function (state, action) {
  return _extends({}, state, { isOpen: false, highlightedIndex: null });
}), _defineProperty(_handlers, _actions.SELECT_ITEM, function (state, action) {
  var _action$payload2 = action.payload;
  var index = _action$payload2.index;
  var getItemValue = _action$payload2.fn.getItemValue;

  var item = state.items[index];
  return _extends({}, state, {
    isOpen: false, highlightedIndex: null, text: getItemValue(item)
  });
}), _defineProperty(_handlers, _actions.SET_HIGHLIGHT, function (state, action) {
  return _extends({}, state, { isOpen: true, highlightedIndex: action.payload });
}), _defineProperty(_handlers, _actions.CLEAR_HIGHLIGHT, function (state, action) {
  return _extends({}, state, { highlightedIndex: null });
}), _handlers);

function reducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initial : arguments[0];
  var action = arguments[1];

  var handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}