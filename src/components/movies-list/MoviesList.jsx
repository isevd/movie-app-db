import React from 'react';

import Movie from '../movie/Movie.jsx';

import './MoviesList.css';

const MoviesList = ({ movies, rateMovie }) => {
  MoviesList.defaultProps = {
    movies: [],
    genres: [],
  };

  return (
    <ul className="movies-list">
      {movies.map((item) => {
        const { id, ...itemProps } = item;

        return (
          <Movie
            key={id}
            movieId={id}
            posterPath={itemProps.poster_path}
            releaseDate={itemProps.release_date}
            title={itemProps.title}
            voteAverage={itemProps.vote_average}
            overview={itemProps.overview}
            rating={itemProps.rating}
            rateMovie={rateMovie}
            genreIds={itemProps.genre_ids}
          />
        );
      })}
    </ul>
  );
};

export default MoviesList;
