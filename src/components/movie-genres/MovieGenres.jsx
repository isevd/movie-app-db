import { Component } from 'react';
import { Tag } from 'antd';

import './MovieGenres.css';

import MovieGenresContext from '../../context/movie-genres-context/MovieGenresContext';

export default class MovieGenres extends Component {
  static contextType = MovieGenresContext;

  getGenresName = (genreIds) => {
    const genres = this.context;
    return genreIds.map((id) => {
      for (const el of genres) {
        if (id === el.id) return el.name;
      }
    });
  };

  render() {
    const { genreIds } = this.props;

    return (
      <div className="genres">
        {this.getGenresName(genreIds).map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    );
  }
}
