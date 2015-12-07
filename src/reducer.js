import {
  CHANGE_TEXT, OPEN_LIST, CLOSE_LIST,
  SELECT_ITEM, SET_HIGHLIGHT, CLEAR_HIGHLIGHT
} from './actions';

const initial = {
  text: 'Ma',
  isOpen: false,
  highlightedIndex: null,
  items: [],
};

function getViewItems(text, fn) {
  const { getItems, shouldItemRender, sortItems } = fn;
  let items = getItems();
  if (shouldItemRender) {
    items = items.filter(item => shouldItemRender(item, text));
  }
  if (sortItems) {
    items.sort((a, b) => sortItems(a, b, text));
  }
  return items;
}

const handlers = {
  [CHANGE_TEXT]: function (state, action) {
    const { text, fn } = action.payload;
    return { ...state, text, items: getViewItems(text, fn) };
  },
  [OPEN_LIST]: function (state, action) {
    const { text } = state;
    const { fn } = action.payload;
    return { ...state, isOpen: true, highlightedIndex: null, items: getViewItems(text, fn) };
  },
  [CLOSE_LIST]: function (state, action) {
    return { ...state, isOpen: false, highlightedIndex: null };
  },
  [SELECT_ITEM]: function (state, action) {
    const { index, fn: { getItemValue } } = action.payload;
    const item = state.items[index];
    return { ...state,
      isOpen: false, highlightedIndex: null, text: getItemValue(item)
    };
  },
  [SET_HIGHLIGHT]: function (state, action) {
    return { ...state, isOpen: true, highlightedIndex: action.payload };
  },
  [CLEAR_HIGHLIGHT]: function (state, action) {
    return { ...state, highlightedIndex: null };
  },
};

export default function reducer(state = initial, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
