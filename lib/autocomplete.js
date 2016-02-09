'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Autocomplete = (function (_Component) {
  _inherits(Autocomplete, _Component);

  function Autocomplete(props) {
    _classCallCheck(this, Autocomplete);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Autocomplete).call(this, props));

    _this._ignoreBlur = false;
    _this._performAutoCompleteOnUpdate = false;
    _this._performAutoCompleteOnKeyUp = false;

    _this.state = {
      menuTop: 0,
      menuLeft: 0,
      menuWidth: 0
    };
    return _this;
  }

  _createClass(Autocomplete, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.dispatch(actions.init({ props: this.exportProps() }));
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.isOpen === true && prevProps.isOpen === false) {
        this.setMenuPositions();
      }

      if (this.props.isOpen && this._performAutoCompleteOnUpdate) {
        this._performAutoCompleteOnUpdate = false;
        this.maybeAutoCompleteText();
      }

      this.maybeScrollItemIntoView();
    }
  }, {
    key: 'exportProps',
    value: function exportProps() {
      var _props = this.props;
      var staticItems = _props.staticItems;
      var getItemValue = _props.getItemValue;
      var shouldItemRender = _props.shouldItemRender;
      var sortItems = _props.sortItems;
      var sortGroups = _props.sortGroups;

      return { staticItems: staticItems, getItemValue: getItemValue, shouldItemRender: shouldItemRender, sortItems: sortItems, sortGroups: sortGroups };
    }
  }, {
    key: 'maybeScrollItemIntoView',
    value: function maybeScrollItemIntoView() {
      if (this.props.isOpen === true && this.props.highlightedIndex !== null) {
        var itemNode = _reactDom2.default.findDOMNode(this.refs['item-' + this.props.highlightedIndex]);
        var menuNode = _reactDom2.default.findDOMNode(this.refs.menu);
        itemNode && (0, _domScrollIntoView2.default)(itemNode, menuNode, { onlyScrollIfNeeded: true });
      }
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (Autocomplete.keyDownHandlers[event.key]) {
        Autocomplete.keyDownHandlers[event.key].call(this, event);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this._performAutoCompleteOnKeyUp = true;
      this.props.dispatch(actions.setText({ text: event.target.value, props: this.exportProps() }));
      this.props.onChange(event, event.target.value);
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp() {
      if (this._performAutoCompleteOnKeyUp) {
        this._performAutoCompleteOnKeyUp = false;
        this.maybeAutoCompleteText();
      }
    }
  }, {
    key: 'maybeAutoCompleteText',
    value: function maybeAutoCompleteText() {
      var _props2 = this.props;
      var text = _props2.text;
      var highlightedIndex = _props2.highlightedIndex;
      var getItemValue = _props2.getItemValue;

      if (text === '') {
        return;
      }
      var items = this.props.items;
      if (items.length === 0) {
        return;
      }
      var matchedItem = highlightedIndex !== null ? items[highlightedIndex] : items[0];
      var itemValue = getItemValue(matchedItem);
      var itemValueDoesMatch = itemValue.toLowerCase().indexOf(text.toLowerCase()) === 0;
      if (itemValueDoesMatch) {
        if (highlightedIndex === null) {
          this.highlightItemFromMouse(matchedItem, 0);
        }
        var node = _reactDom2.default.findDOMNode(this.refs.input);
        node.value = itemValue;
        node.setSelectionRange(text.length, itemValue.length);
      }
    }
  }, {
    key: 'setMenuPositions',
    value: function setMenuPositions() {
      var node = _reactDom2.default.findDOMNode(this.refs.input);
      var rect = node.getBoundingClientRect();
      var computedStyle = getComputedStyle(node);
      var marginBottom = parseInt(computedStyle.marginBottom, 10);
      var marginLeft = parseInt(computedStyle.marginLeft, 10);
      var marginRight = parseInt(computedStyle.marginRight, 10);
      this.setState({
        menuTop: rect.bottom + marginBottom,
        menuLeft: rect.left + marginLeft,
        menuWidth: rect.width + marginLeft + marginRight
      });
    }
  }, {
    key: 'highlightItemFromMouse',
    value: function highlightItemFromMouse(item, index) {
      this.props.dispatch(actions.setHighlight(index));
    }
  }, {
    key: 'selectItemFromMouse',
    value: function selectItemFromMouse(item, index) {
      var _props3 = this.props;
      var onSelect = _props3.onSelect;
      var getItemValue = _props3.getItemValue;
      var dispatch = _props3.dispatch;

      var value = getItemValue(item);
      dispatch(actions.selectItem({ index: index, props: this.exportProps() }));
      dispatch(actions.clearItems());
      onSelect(value, item);
      this.setIgnoreBlur(false);
    }
  }, {
    key: 'setIgnoreBlur',
    value: function setIgnoreBlur(ignore) {
      this._ignoreBlur = ignore;
    }
  }, {
    key: 'renderMenu',
    value: function renderMenu() {
      var _this2 = this;

      var group = undefined;
      var items = this.props.items.map(function (item, index) {
        var element = _this2.props.renderItem(item, _this2.props.highlightedIndex === index, { cursor: 'default' });
        var header = undefined;
        if (item.group && group !== item.group) {
          header = _react2.default.createElement(
            'div',
            { style: _this2.props.headerStyle },
            item.group
          );
          group = item.group;
        }
        return [header, _react2.default.cloneElement(element, {
          onMouseDown: function onMouseDown() {
            return _this2.setIgnoreBlur(true);
          },
          onMouseEnter: function onMouseEnter() {
            return _this2.highlightItemFromMouse(item, index);
          },
          onClick: function onClick() {
            return _this2.selectItemFromMouse(item, index);
          },
          ref: 'item-' + index
        })];
      }).reduce(function (list, ary) {
        return list.concat(ary.filter(function (i) {
          return !!i;
        }));
      }, []);
      var style = {
        left: this.state.menuLeft,
        top: this.state.menuTop,
        minWidth: this.state.menuWidth
      };
      var menu = this.props.renderMenu(items, this.props.text, style);
      return _react2.default.cloneElement(menu, { ref: 'menu' });
    }
  }, {
    key: 'handleInputBlur',
    value: function handleInputBlur() {
      if (this._ignoreBlur) {
        return;
      }
      this.props.dispatch(actions.closeList());
    }
  }, {
    key: 'handleInputFocus',
    value: function handleInputFocus() {
      if (this._ignoreBlur) {
        return;
      }
      this.props.dispatch(actions.openList({ props: this.exportProps() }));
    }
  }, {
    key: 'handleInputClick',
    value: function handleInputClick() {
      if (this.props.isOpen === false) {
        this.props.dispatch(actions.openList({ props: this.exportProps() }));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { style: { display: 'inline-block' } },
        _react2.default.createElement('input', _extends({}, this.props.inputProps, {
          role: 'combobox',
          'aria-autocomplete': 'both',
          ref: 'input',
          onFocus: this.handleInputFocus.bind(this),
          onBlur: this.handleInputBlur.bind(this),
          onChange: function onChange(event) {
            return _this3.handleChange(event);
          },
          onKeyDown: function onKeyDown(event) {
            return _this3.handleKeyDown(event);
          },
          onKeyUp: function onKeyUp(event) {
            return _this3.handleKeyUp(event);
          },
          onClick: this.handleInputClick.bind(this),
          value: this.props.text
        })),
        this.props.isOpen && this.renderMenu()
      );
    }
  }]);

  return Autocomplete;
})(_react.Component);

Autocomplete.propTypes = {
  // Props from state tree
  text: _react.PropTypes.string.isRequired,
  isOpen: _react.PropTypes.bool.isRequired,
  highlightedIndex: _react.PropTypes.number,
  items: _react.PropTypes.array.isRequired,

  // Props from wrapper props
  renderItem: _react.PropTypes.func.isRequired,
  getItemValue: _react.PropTypes.func.isRequired,
  inputProps: _react.PropTypes.object,
  staticItems: _react.PropTypes.array,
  onChange: _react.PropTypes.func,
  onSelect: _react.PropTypes.func,
  shouldItemRender: _react.PropTypes.func,
  sortItems: _react.PropTypes.func,
  sortGroups: _react.PropTypes.func,
  menuStyle: _react.PropTypes.object,
  headerStyle: _react.PropTypes.object
};

Autocomplete.defaultProps = {
  inputProps: {},
  onChange: function onChange() {},
  onSelect: function onSelect(value, item) {},
  renderMenu: function renderMenu(items, value, style) {
    return _react2.default.createElement('div', { style: _extends({}, style, Autocomplete.defaultProps.menuStyle), children: items });
  },
  shouldItemRender: function shouldItemRender() {
    return true;
  },
  menuStyle: {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'fixed',
    overflow: 'auto',
    maxHeight: '50%' },
  // TODO: don't cheat, let it flow to the bottom
  headerStyle: {
    padding: '2px 6px',
    fontSize: '1.2em',
    backgroundColor: '#ddd'
  }
};

Autocomplete.keyDownHandlers = {
  ArrowDown: function ArrowDown(event) {
    // Make 'this' free
    event.preventDefault();
    var _props4 = this.props;
    var highlightedIndex = _props4.highlightedIndex;
    var dispatch = _props4.dispatch;

    var index = highlightedIndex === null || highlightedIndex === this.props.items.length - 1 ? 0 : highlightedIndex + 1;
    this._performAutoCompleteOnKeyUp = true;
    dispatch(actions.setHighlight(index));
  },

  ArrowUp: function ArrowUp(event) {
    // Make 'this' free
    event.preventDefault();
    var _props5 = this.props;
    var highlightedIndex = _props5.highlightedIndex;
    var dispatch = _props5.dispatch;

    var index = highlightedIndex === 0 || highlightedIndex === null ? this.props.items.length - 1 : highlightedIndex - 1;
    this._performAutoCompleteOnKeyUp = true;
    dispatch(actions.setHighlight(index));
  },

  Enter: function Enter(event) {
    // Make 'this' free
    var _props6 = this.props;
    var isOpen = _props6.isOpen;
    var highlightedIndex = _props6.highlightedIndex;
    var text = _props6.text;
    var onSelect = _props6.onSelect;
    var dispatch = _props6.dispatch;

    if (isOpen === false) {
      // already selected this, do nothing
      return;
    } else if (highlightedIndex == null) {
      // hit enter after focus but before typing anything so no autocomplete attempt yet
      dispatch(actions.closeList());
      _reactDom2.default.findDOMNode(this.refs.input).select();
    } else {
      var item = this.props.items[highlightedIndex];
      dispatch(actions.selectItem({ index: highlightedIndex, props: this.exportProps() }));
      // ReactDOM.findDOMNode(this.refs.input).focus() // TODO: file issue
      _reactDom2.default.findDOMNode(this.refs.input).setSelectionRange(text.length, text.length);
      onSelect(text, item);
    }
  },

  Escape: function Escape(event) {
    // Make 'this' free
    this.props.dispatch(actions.closeList());
  },

  Backspace: function Backspace(event) {
    // Make 'this' free
    var node = _reactDom2.default.findDOMNode(this.refs.input);
    node.value = this.props.text;
  }
};

function select(state, ownProps) {
  var autocomplete = state.autocomplete;

  return _extends({}, ownProps, autocomplete);
}

exports.default = (0, _reactRedux.connect)(select)(Autocomplete);