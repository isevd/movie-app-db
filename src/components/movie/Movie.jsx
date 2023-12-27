import { Component } from 'react';
import { Rate, Spin } from 'antd';
import { format } from 'date-fns';
import './Movie.css';

import MovieRating from '../movie-rating/MovieRating';
import MovieGenres from '../movie-genres/MovieGenres';

export default class Movie extends Component {
  state = {
    loaded: false,
  };

  getTruncText = (text, maxLength) => {
    let result = text;
    if (text.length > maxLength) {
      result = result.substring(0, maxLength).replace(/\s+\S*$/, '');
      return result + '...';
    } else {
      return text;
    }
  };

  getGenresName = (genres, filmGenres) => {
    return filmGenres.map((id) => {
      for (const el of genres) {
        if (id === el.id) return el.name;
      }
    });
  };

  getMovieDate = (date) => {
    if (date) {
      return format(new Date(date), 'MMMM d, y');
    }
    return 'N/A';
  };

  render() {
    const { title, posterPath, releaseDate, overview, rating, rateMovie, genreIds, voteAverage } = this.props;

    const posterImage = posterPath
      ? `https://image.tmdb.org/t/p/original${posterPath}`
      : 'https://upload.wikimedia.org/wikipedia/commons/c/c2/No_image_poster.png';

    const overView = overview ? this.getTruncText(overview, 200) : 'No description';

    return (
      <div className="movie">
        {!this.state.loaded && <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        <img
          src={posterImage}
          alt="poster"
          className="poster"
          style={this.state.loaded ? {} : { display: 'none' }}
          onError={() => this.setState({ loaded: true })}
          onLoad={() => this.setState({ loaded: true })}
        />
        <div className="info">
          <div className="movie-header">
            <h5 className="title">{this.getTruncText(title, 17)}</h5>
            <MovieRating voteAverage={voteAverage} />
          </div>
          <div className="movie-main">
            <span className="date">{this.getMovieDate(releaseDate)}</span>
            <MovieGenres genreIds={genreIds} />
          </div>
          <div className="description">
            <p className="text">{overView}</p>
          </div>
          <Rate
            className="movie-rate"
            onChange={(e) => rateMovie(this.props.movieId, e)}
            defaultValue={0}
            value={rating}
            count={10}
          />
        </div>
      </div>
    );
  }
}
