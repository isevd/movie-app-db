export default class MovieAppService {
  API_BASE = 'https://api.themoviedb.org/3/';
  API_KEY = 'b52e45e3f294c3fc4cd33a1f0c3279b5';
  API_IMG = 'https://image.tmdb.org/t/p/original';
  EMPTY_IMG = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/No_image_poster.png';

  getResource = async (url) => {
    const link = `${this.API_BASE}${url}api_key=${this.API_KEY}`;
    try {
      const res = await fetch(link);
      return await res.json();
    } catch (e) {
      throw new Error(`Could not fetch ${url}, received ${e.status}`);
    }
  };

  setResource = async (url, body) => {
    const link = `${this.API_BASE}${url}api_key=${this.API_KEY}`;
    try {
      await fetch(link, {
        method: 'POST',
        body: body,
      });
    } catch (e) {
      throw new Error(`Could not fetch ${url}, received ${e.status}`);
    }
  };

  searchMoviesByName = async (movieName, page = 1) => {
    const res = await this.getResource(`search/movie?query=${movieName}&page=${page}&`);
    return res;
  };

  getReturnMovies = async (page = 1) => {
    return await this.getResource(`search/movie?query=return&page=${page}&`);
  };

  getGenreMovieList = async () => {
    return await this.getResource('genre/movie/list?');
  };

  getGuestToken = async () => {
    const res = await this.getResource('authentication/guest_session/new?');
    if (!sessionStorage.getItem('guest_token')) {
      sessionStorage.setItem('guest_token', res.guest_session_id);
    }
  };

  getRatedMovies = async (page) => {
    return await this.getResource(`guest_session/${sessionStorage.getItem('guest_token')}/rated/movies?page=${page}&`);
  };

  guestRateMovie = async (movieId, value) => {
    const data = new FormData();
    data.append('value', value);
    await this.setResource(`movie/${movieId}/rating?guest_session_id=${sessionStorage.getItem('guest_token')}&`, data);
  };
}
