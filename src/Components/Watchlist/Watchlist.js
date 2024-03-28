import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Watchlist.css';

const Watchlist = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginData = localStorage.getItem('loginData');
      if (!loginData) {
        // user is not logged in, redirect to login
        navigate('/');
      } else {
        try {
          const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
          console.log('Stored favorites:', storedFavorites); // Log stored favorites
          setFavorites(storedFavorites);
        } catch (error) {
          console.error('Error retrieving favorites from local storage:', error);
        }
      }
    };

    checkLoginStatus();
  }, [navigate]); // 

  const handleRemoveFromWatchlist = (movieId, movieTitle) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${movieTitle} from your watchlist?`);
    if (confirmation) {
      // filter and update the favorites list
      const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
      // update local storage with kist of favorites
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
     
      setFavorites(updatedFavorites);
    }
  };

  const handleDeleteAll = () => {
    const confirmation = window.confirm(`Are you sure you want to delete all movies from your watchlist?`);
    if (confirmation) {
      localStorage.removeItem('favorites');
      setFavorites([]);
    }
  };

  return (
    <div>
      <div className="watchlist-container">
        <div className="header">
          <h2 className='Mywatchlist'>My Watchlist</h2>
          <button className="delete-all-btn" onClick={handleDeleteAll}>Delete All Movies from Watchlist</button>
        </div>
        <div className="movies-container">
          {favorites.length > 0 ? (
            favorites.map((movie, index) => (
              <div className="movie-card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <p>{movie.title}</p>
                <p>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
                <p>IMDb Rating: {movie.vote_average}</p>
                <button onClick={() => handleRemoveFromWatchlist(movie.id, movie.title)}>Remove from Watchlist</button>
              </div>
            ))
          ) : (
            <p className="empty-watchlist-message">Your watchlist is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
