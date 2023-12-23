import { Component } from 'react';
import { Spin, Tabs } from 'antd';
import { debounce } from 'lodash';
import { Offline, Online } from 'react-detect-offline';

import MovieGenresContext from '../context/movie-genres-context/MovieGenresContext';
import MovieAppService from '../../services/MovieAppService';
import MoviesList from '../movies-list/MoviesList';
import ComponentState from '../component-state/ComponentState';
import MovieSearchForm from '../movie-search-form/MovieSearchForm';
import PaginationComponent from '../pagination-component/PaginationComponent';

import './App.css';

const movieAppService = new MovieAppService();

export default class App extends Component {
  state = {
    movies: [],
    ratedMovies: [],
    genres: [],
    searchState: {
      loading: false,
      error: false,
      emptySearch: false,
    },
    ratedState: {
      loading: false,
      error: false,
    },
    searchValue: '',
    page: 1,
    totalMovies: 0,
    totalRatedMovies: 0,
    ratedPage: 1,
  };

  componentDidMount() {
    movieAppService
      .getGuestToken()
      .then(() => {
        this.getReturnMovies();
        this.updateRatedMovies();
      })
      .catch(() => alert('Failed to create guest session'));
    this.getGenres();
  }

  onMoviesLoaded() {
    this.setState({ searchState: { loading: false, error: false, emptySearch: false } });
  }

  onError() {
    this.setState({ searchState: { loading: false, error: true, emptySearch: false } });
  }

  onEmptySearch() {
    this.setState({ searchState: { loading: false, error: false, emptySearch: true } });
  }

  setMovies(movies) {
    if (movies.results.length > 0) {
      const total = movies.total_results > 10000 ? 10000 : movies.total_results;
      this.setState((state) => {
        return {
          movies: this.setRatedMovies(movies.results, state.ratedMovies),
          totalMovies: total,
          searchState: { loading: false, error: false, emptySearch: false },
        };
      });
    } else {
      this.onEmptySearch();
    }
  }

  updateMovies = (movieName, page = 1) => {
    this.setState({ movies: [], totalMovies: 0, searchState: { loading: true, error: false, emptySearch: false } });
    if (movieName.trim() === '') {
      this.setState({ searchState: { loading: true, error: false, emptySearch: false } });
      this.getReturnMovies();
    } else {
      movieAppService
        .searchMoviesByName(`${movieName}`, page)
        .then((el) => {
          this.setMovies(el);
          if (el.results > 0) this.onMoviesLoaded();
        })
        .catch(() => {
          this.onError();
        });
    }
  };

  searchMovies = () => {
    if (this.state.page !== 1) {
      this.setState({ page: 1 });
    } else this.updateMovies(this.state.searchValue);
  };

  getReturnMovies = (page) => {
    movieAppService
      .getReturnMovies(page)
      .then((el) => {
        this.setMovies(el);
      })
      .catch(() => {
        this.onError();
      });
  };

  updateRatedMovies = async (page = 1) => {
    try {
      this.setState({ ratedState: { loading: true, error: false } });
      const data = await movieAppService.getRatedMovies(page);
      this.setState({
        ratedMovies: data.results,
        totalRatedMovies: data.total_results,
        ratedState: { loading: false, error: false },
      });
    } catch {
      this.setState({ ratedState: { loading: false, error: true } });
    }
  };

  getGenres() {
    movieAppService.getGenreMovieList().then((el) => {
      this.setState({ genres: el.genres });
    });
  }

  setRatedMovies = (movies, ratedMovies) => {
    return movies.map((el) => {
      for (let i of ratedMovies) {
        if (el.id === i.id) return i;
      }
      return el;
    });
  };

  debouncedSearch = debounce(() => {
    this.searchMovies();
  }, 600);

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchValue !== this.state.searchValue) {
      this.debouncedSearch();
    }
    if (prevState.page !== this.state.page) {
      if (this.state.searchValue) {
        this.updateMovies(this.state.searchValue, this.state.page);
      } else {
        this.getReturnMovies(this.state.page);
      }
    }
    if (prevState.ratedPage !== this.state.ratedPage) {
      this.updateRatedMovies(this.state.ratedPage);
    }
    if (prevState.ratedMovies !== this.state.ratedMovies) {
      this.setState(({ movies, ratedMovies }) => {
        return {
          movies: this.setRatedMovies(movies, ratedMovies),
        };
      });
    }
  }

  rateMovie = async (id, rating) => {
    try {
      await movieAppService.guestRateMovie(id, rating);
      this.setState(({ movies }) => {
        return {
          movies: movies.map((el) => (el.id === id ? { ...el, rating: rating } : el)),
        };
      });
    } catch {
      if (!sessionStorage.getItem('guest_token')) {
        await movieAppService.getGuestToken();
        await this.rateMovie();
      }
    }
  };

  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  setPage = (page) => {
    this.setState({ page: page, searchState: { loading: true, error: false, emptySearch: false } });
  };

  setRatedPage = (page) => {
    this.setState({ ratedPage: page, ratedState: { loading: true, error: false } });
  };

  render() {
    const {
      movies,
      ratedMovies,
      genres,
      page,
      totalMovies,
      totalRatedMovies,
      ratedPage,
      searchState,
      ratedState,
      searchValue,
    } = this.state;
    const searchTab = (
      <>
        <MovieSearchForm searchValue={searchValue} setSearchValue={this.handleSearch} />
        <ComponentState componentState={searchState}>
          <MoviesList rateMovie={this.rateMovie} movies={movies} />
        </ComponentState>
        <PaginationComponent totalMovies={totalMovies} page={page} onChange={this.setPage} />
      </>
    );

    const ratedTab = (
      <>
        <ComponentState componentState={ratedState}>
          <MoviesList rateMovie={this.rateMovie} movies={ratedMovies} />
        </ComponentState>
        <PaginationComponent totalMovies={totalRatedMovies} page={ratedPage} onChange={this.setRatedPage} />
      </>
    );

    const items = [
      { label: 'Search', key: 'item-1', children: searchTab },
      { label: 'Rated', key: 'item-2', children: ratedTab },
    ];

    return (
      <div className="wrapper">
        <Online>
          <MovieGenresContext.Provider value={genres}>
            <Tabs
              className="switch"
              centered
              items={items}
              onTabClick={(key) => {
                if (key === 'item-2') this.updateRatedMovies();
              }}
            />
          </MovieGenresContext.Provider>
        </Online>
        <Offline>
          <Spin style={{ position: 'fixed', top: '50%', left: '50%' }} size="large" />
        </Offline>
      </div>
    );
  }
}
