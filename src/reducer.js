import {
  INIT_ITEMS, CHANGE_TEXT, OPEN_LIST, CLOSE_LIST,
  SELECT_ITEM, SET_HIGHLIGHT, CLEAR_HIGHLIGHT
} from './actions';

const initial = {
  text: 'Ma',
  isOpen: false,
  highlightedIndex: null,
  items: [],
};

const handlers = {
  [INIT_ITEMS]: function (state, action) {
    const { text } = state;
    const { items, fn: { getItemValue } } = action.payload;
    // TODO: Use shouldItemRender and sortItems
    const newItems = items.map(item => ({
      ...item, hidden: (text ? getItemValue(item).toLowerCase().indexOf(text.toLowerCase()) === -1 : false)
    }));
    return { ...state, items: newItems };
  },
  [CHANGE_TEXT]: function (state, action) {
    const { items } = state;
    const { text, fn: { getItemValue } } = action.payload;
    // TODO: Use shouldItemRender and sortItems
    const newItems = items.map(item => ({
      ...item, hidden: (text ? getItemValue(item).toLowerCase().indexOf(text.toLowerCase()) === -1 : false)
    }));
    return { ...state, text, items: newItems };
  },
  [OPEN_LIST]: function (state, action) {
    return { ...state, isOpen: true, highlightedIndex: null };
  },
  [CLOSE_LIST]: function (state, action) {
    return { ...state, isOpen: false, highlightedIndex: null };
  },
  [SELECT_ITEM]: function (state, action) {
    const item = state.items[action.payload];
    return { ...state,
      isOpen: false, highlightedIndex: null, text: item.name // FIXME: use getitemvalue()
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
