import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import './Main.css';

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = 'https://api.themoviedb.org/3';
const RANDOM_API = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=`;
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // extract search term from URL
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Fetch movies based on search term and page
    fetchMovies(searchParam); // Pass searchParam to fetchMovies
  }, [page, location.search]);

  const fetchMovies = async (searchParam) => { // Accept searchParam as a parameter
    let url = searchParam ? `${SEARCH_API}${encodeURIComponent(searchParam)}&page=${page}` : `${RANDOM_API}${page}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setPage(1);
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setPage(1);
    navigate('/');
    fetchMovies(''); //  reset to random movies
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSeeMore = (movieId) => {
    navigate(`/home/${movieId}`);
  };

  const handleAddToFavorites = async (movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (!favorites.find(movie => movie.id === data.id)) {
        favorites.push(data);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${data.title} has been added to your watchlist`);
      } else {
        alert(`${data.title} is already in your watchlist`);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };
  
  
  return (
    
    <div className="main-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClear}> Clear </button>
      </div>
      <div className="movies-container">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
            <p>{movie.title}</p>
            <p>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
            <p>IMDb Rating: {movie.vote_average}</p>
            <button onClick={() => handleSeeMore(movie.id)}>See More</button>
            <button onClick={() => handleAddToFavorites(movie.id)}>Add to my Watchlist</button>
          </div>
        ))}
      </div>
      {movies.length > 0 && page < totalPages && <button className="load-more" onClick={loadMore}>Load More</button>}
      <div className="scroll-to-top" onClick={scrollToTop}>
        <FaArrowUp size={30} />
      </div>
    </div>
  );
};

export default Main;
