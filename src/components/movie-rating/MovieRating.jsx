import './MovieRating.css';

const MovieRating = ({ voteAverage }) => {
  const movieRatingColor = (value) => {
    switch (true) {
      case value >= 0 && value <= 3:
        return '#E90000';
      case value > 3 && value <= 5:
        return '#E97E00';
      case value > 5 && value <= 7:
        return '#E9D100';
      case value > 7:
        return '#66E900';
      default:
        return 'black';
    }
  };

  const color = movieRatingColor(voteAverage);
  return (
    <div className="movie-rating" style={{ borderColor: color }}>
      <span className="movie-rating-number">{voteAverage.toFixed(1)}</span>
    </div>
  );
};
export default MovieRating;
