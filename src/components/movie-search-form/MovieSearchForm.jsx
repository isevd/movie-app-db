import { Component } from 'react';

import './MovieSearchForm.css';

export default class MovieSearchForm extends Component {
  render() {
    const { searchValue, setSearchValue } = this.props;

    return (
      <input
        type="text"
        placeholder="Type to search..."
        className="search-input"
        value={searchValue}
        onChange={setSearchValue}
      />
    );
  }
}
