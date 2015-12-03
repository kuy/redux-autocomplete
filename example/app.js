import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getStates, matchStateToTerm, sortStates, styles } from './utils';
import Autocomplete from '../src/autocomplete';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Basic Example X</h1>

        <p>
          When using static data, you use the client to sort and filter the items,
          so <code>Autocomplete</code> has methods baked in to help.
        </p>

        <Autocomplete
          initialItems={getStates()}
          getItemValue={(item) => item.name}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
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
