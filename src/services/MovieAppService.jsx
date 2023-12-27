export default class MovieAppService {
  urlMovie = new URL('https://api.themoviedb.org/3/');
  apiKey = 'b52e45e3f294c3fc4cd33a1f0c3279b5';
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNTJlNDVlM2YyOTRjM2ZjNGNkMzNhMWYwYzMyNzliNSIsInN1YiI6IjY1NmUwZTE3MDVhNTMzMDBjNjZhZTBlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TTBPQZ98mOGo60oynBbjTruEbC0HIkODarwgZsHOwSo',
    },
  };

  getResource = async (url) => {
    const link = `${this.urlMovie}${url}api_key=${this.apiKey}`;
    try {
      const res = await fetch(link);
      return await res.json();
    } catch (e) {
      throw new Error(`Could not fetch ${url}, received ${e.status}`);
    }
  };

  setResource = async (url, body) => {
    const link = `${this.urlMovie}${url}api_key=${this.apiKey}`;
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
    const url = new URL('search/movie?', this.urlMovie);
    url.searchParams.set('query', movieName);
    url.searchParams.set('page', page);
    const response = await fetch(url, this.options);
    if (!response.ok) {
      throw new Error(response.status);
    }
    return await response.json();
  };

  getReturnMovies = async (page = 1) => {
    const url = new URL('search/movie?', this.urlMovie);
    url.searchParams.set('query', 'return');
    url.searchParams.set('page', page);
    const response = await fetch(url, this.options);
    if (!response.ok) {
      throw new Error(response.status);
    }
    return await response.json();
  };

  getGenreMovieList = async () => {
    const url = new URL('genre/movie/list', this.urlMovie);
    const response = await fetch(url, this.options);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return await data;
  };

  getGuestToken = async () => {
    if (!localStorage.getItem('guest_token')) {
      const res = await this.getResource('authentication/guest_session/new?');
      localStorage.setItem('guest_token', res.guest_session_id);
    }
  };

  getRatedMovies = async (page = 1) => {
    return await this.getResource(`guest_session/${localStorage.getItem('guest_token')}/rated/movies?page=${page}&`);
  };

  guestRateMovie = async (movieId, value) => {
    const data = new FormData();
    data.append('value', value);
    await this.setResource(`movie/${movieId}/rating?guest_session_id=${localStorage.getItem('guest_token')}&`, data);
  };
}
