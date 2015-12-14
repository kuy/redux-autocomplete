import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getMixed, matchStateToTerm, sortStates, sortGroups, styles } from '../utils';
import { Autocomplete } from '../../src/index';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Multiple Columns Example</h1>

        <p>
          When using static data, you use the client to sort and filter the items,
          so <code>Autocomplete</code> has methods baked in to help.
        </p>

        <Autocomplete
          staticItems={getMixed()}
          getItemValue={item => item.name}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
          sortGroups={sortGroups}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.abbr}
            >{item.name} ({item.group})</div>
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
