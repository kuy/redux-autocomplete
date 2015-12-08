import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getStates, matchStateToTerm, sortStates, styles } from '../utils';
import { Autocomplete, actions } from '../../src/index';

class App extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <h1>Async Example</h1>

        <p>
          When using async data, you use the client to sort and filter the items,
          so <code>Autocomplete</code> has methods baked in to help.
        </p>

        <Autocomplete
          getItemValue={item => item.name}
          onChange={(e, text) => {
            // Fake async loading
            setTimeout(() => {
              const items = getStates().filter(item => matchStateToTerm(item, text));
              items.sort((a, b) => sortStates(a, b, text));
              dispatch(actions.setItems(items));
            }, 1500);
          }}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.abbr}
            >{item.name}</div>
          )}
        />
      </div>
    );
  }
}

function select(state) {
  const { app } = state;
  return { app };
}

export default connect(select)(App);
