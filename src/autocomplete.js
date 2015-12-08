import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import scrollIntoView from 'dom-scroll-into-view';
import { connect } from 'react-redux';
import * as actions from './actions';

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this._ignoreBlur = false;
    this._performAutoCompleteOnUpdate = false;
    this._performAutoCompleteOnKeyUp = false;

    this.state = {
      menuTop: 0,
      menuLeft: 0,
      menuWidth: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen === true && prevProps.isOpen === false) {
      this.setMenuPositions();
    }

    if (this.props.isOpen && this._performAutoCompleteOnUpdate) {
      this._performAutoCompleteOnUpdate = false;
      this.maybeAutoCompleteText();
    }

    this.maybeScrollItemIntoView();
  }

  getFuncSet() {
    const { getItems, getItemValue, shouldItemRender, sortItems } = this.props;
    return { getItems, getItemValue, shouldItemRender, sortItems };
  }

  maybeScrollItemIntoView () {
    if (this.props.isOpen === true && this.props.highlightedIndex !== null) {
      var itemNode = ReactDOM.findDOMNode(this.refs[`item-${this.props.highlightedIndex}`]);
      var menuNode = ReactDOM.findDOMNode(this.refs.menu);
      scrollIntoView(itemNode, menuNode, { onlyScrollIfNeeded: true });
    }
  }

  handleKeyDown (event) {
    if (Autocomplete.keyDownHandlers[event.key]) {
      Autocomplete.keyDownHandlers[event.key].call(this, event);
    }
  }

  handleChange (event) {
    this._performAutoCompleteOnKeyUp = true;
    this.props.dispatch(actions.setText({ text: event.target.value, fn: this.getFuncSet() }));
    this.props.onChange(event, event.target.value);
  }

  handleKeyUp () {
    if (this._performAutoCompleteOnKeyUp) {
      this._performAutoCompleteOnKeyUp = false;
      this.maybeAutoCompleteText();
    }
  }

  maybeAutoCompleteText () {
    var { text, highlightedIndex, getItemValue } = this.props;
    if (text === '') {
      return;
    }
    var items = this.props.items;
    if (items.length === 0) {
      return;
    }
    var matchedItem = highlightedIndex !== null ?
      items[highlightedIndex] : items[0];
    var itemValue = getItemValue(matchedItem);
    var itemValueDoesMatch = (itemValue.toLowerCase().indexOf(
      text.toLowerCase()
    ) === 0);
    if (itemValueDoesMatch) {
      if (highlightedIndex === null) {
        this.highlightItemFromMouse(matchedItem, 0);
      }
      var node = ReactDOM.findDOMNode(this.refs.input);
      node.value = itemValue;
      node.setSelectionRange(text.length, itemValue.length);
    }
  }

  setMenuPositions () {
    var node = ReactDOM.findDOMNode(this.refs.input)
    var rect = node.getBoundingClientRect()
    var computedStyle = getComputedStyle(node)
    var marginBottom = parseInt(computedStyle.marginBottom, 10)
    var marginLeft = parseInt(computedStyle.marginLeft, 10)
    var marginRight = parseInt(computedStyle.marginRight, 10)
    this.setState({
      menuTop: rect.bottom + marginBottom,
      menuLeft: rect.left + marginLeft,
      menuWidth: rect.width + marginLeft + marginRight
    })
  }

  highlightItemFromMouse (item, index) {
    this.props.dispatch(actions.setHighlight(index));
  }

  selectItemFromMouse (item, index) {
    const value = this.props.getItemValue(item);
    this.props.dispatch(actions.selectItem({ index, fn: this.getFuncSet() }));
    this.props.onSelect(value, item);
    this.setIgnoreBlur(false);
  }

  setIgnoreBlur (ignore) {
    this._ignoreBlur = ignore
  }

  renderMenu () {
    var items = this.props.items.map((item, index) => {
      var element = this.props.renderItem(
        item,
        this.props.highlightedIndex === index,
        {cursor: 'default'}
      )
      return React.cloneElement(element, {
        onMouseDown: () => this.setIgnoreBlur(true),
        onMouseEnter: () => this.highlightItemFromMouse(item, index),
        onClick: () => this.selectItemFromMouse(item, index),
        ref: `item-${index}`,
      });
    });
    var style = {
      left: this.state.menuLeft,
      top: this.state.menuTop,
      minWidth: this.state.menuWidth,
    };
    var menu = this.props.renderMenu(items, this.props.text, style);
    return React.cloneElement(menu, { ref: 'menu' });
  }

  handleInputBlur () {
    if (this._ignoreBlur) {
      return;
    }
    this.props.dispatch(actions.closeList());
  }

  handleInputFocus () {
    if (this._ignoreBlur) {
      return;
    }
    this.props.dispatch(actions.openList({ fn: this.getFuncSet() }));
  }

  handleInputClick () {
    if (this.props.isOpen === false) {
      this.props.dispatch(actions.openList({ fn: this.getFuncSet() }));
    }
  }

  render () {
    return (
      <div style={{display: 'inline-block'}}>
        <input
          {...this.props.inputProps}
          role="combobox"
          aria-autocomplete="both"
          ref="input"
          onFocus={this.handleInputFocus.bind(this)}
          onBlur={this.handleInputBlur.bind(this)}
          onChange={event => this.handleChange(event)}
          onKeyDown={event => this.handleKeyDown(event)}
          onKeyUp={event => this.handleKeyUp(event)}
          onClick={this.handleInputClick.bind(this)}
          value={this.props.text}
        />
        {this.props.isOpen && this.renderMenu()}
      </div>
    )
  }
}

Autocomplete.propTypes = {
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  highlightedIndex: PropTypes.number,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  shouldItemRender: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  menuStyle: PropTypes.object,
  inputProps: PropTypes.object,
  getItemValue: PropTypes.func,
  getItems: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

Autocomplete.defaultProps = {
  inputProps: {},
  onChange: () => {},
  onSelect: (value, item) => {},
  renderMenu: (items, value, style) => {
    return <div style={{...style, ...Autocomplete.defaultProps.menuStyle}} children={items}/>;
  },
  shouldItemRender: () => true,
  menuStyle: {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '2px 0',
    fontSize: '90%',
    position: 'fixed',
    overflow: 'auto',
    maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
  }
};

Autocomplete.keyDownHandlers = {
  ArrowDown: function (event) { // Make 'this' free
    event.preventDefault();
    var { highlightedIndex, dispatch } = this.props;
    var index = (
      highlightedIndex === null ||
      highlightedIndex === this.props.items.length - 1
    ) ?  0 : highlightedIndex + 1;
    this._performAutoCompleteOnKeyUp = true;
    dispatch(actions.setHighlight(index));
  },

  ArrowUp: function (event) { // Make 'this' free
    event.preventDefault();
    var { highlightedIndex, dispatch } = this.props;
    var index = (
      highlightedIndex === 0 ||
      highlightedIndex === null
    ) ? this.props.items.length - 1 : highlightedIndex - 1;
    this._performAutoCompleteOnKeyUp = true;
    dispatch(actions.setHighlight(index));
  },

  Enter: function (event) { // Make 'this' free
    const { isOpen, highlightedIndex, text, onSelect, dispatch } = this.props;
    if (isOpen === false) {
      // already selected this, do nothing
      return
    } else if (highlightedIndex == null) {
      // hit enter after focus but before typing anything so no autocomplete attempt yet
      dispatch(actions.closeList());
      ReactDOM.findDOMNode(this.refs.input).select();
    } else {
      var item = this.props.items[highlightedIndex];
      dispatch(actions.selectItem({ index: highlightedIndex, fn: this.getFuncSet() }));
      // ReactDOM.findDOMNode(this.refs.input).focus() // TODO: file issue
      ReactDOM.findDOMNode(this.refs.input).setSelectionRange(text.length, text.length);
      onSelect(text, item);
    }
  },

  Escape: function (event) { // Make 'this' free
    this.props.dispatch(actions.closeList());
  },

  Backspace: function (event) { // Make 'this' free
    const node = ReactDOM.findDOMNode(this.refs.input);
    node.value = this.props.text;
  }
};

function select(state, ownProps) {
  const { autocomplete } = state;
  return { ...ownProps, ...autocomplete };
}

export default connect(select)(Autocomplete);
