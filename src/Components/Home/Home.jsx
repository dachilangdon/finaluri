import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=3fd2be6f0c70a2a598f084ddfb75487c&append_to_response=credits`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovieDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [movieId]);

  const handleAddToFavorites = () => {
    //  movieDetails exist check
    if (movieDetails) {
      // movieDetails => localStorage
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      if (!favorites.find(movie => movie.id === movieDetails.id)) {
        favorites.push(movieDetails);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${movieDetails.title} has been added to your watchlist`);
      } else {
        alert(`${movieDetails.title} is already in your watchlist`);
      }
    }
  };

  return (
    <div className="home-container">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : movieDetails ? (
        <div className="movie-details">
          <h2>{movieDetails.title}</h2>
          <img src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} alt={movieDetails.title} />
          <p>{movieDetails.overview}</p>
          <p>Release Year: {movieDetails.release_date ? movieDetails.release_date.substring(0, 4) : 'N/A'}</p>
          <p>IMDb Rating: {movieDetails.vote_average}</p>
          <h3>Cast:</h3>
          <ul>
            {movieDetails.credits.cast.slice(0, 5).map((castMember) => (
              <li key={castMember.cast_id}>{castMember.name}</li>
            ))}
          </ul>
          {movieDetails.credits.crew && (
            <div>
              <h3>Director(s):</h3>
              <ul>
                {movieDetails.credits.crew.filter(member => member.job === 'Director').map((director) => (
                  <li key={director.credit_id}>{director.name}</li>
                ))}
              </ul>
            </div>
          )}
          <p>Budget: {movieDetails.budget ? `$${movieDetails.budget.toLocaleString()}` : 'N/A'}</p>
          <p>Revenue: {movieDetails.revenue ? `$${movieDetails.revenue.toLocaleString()}` : 'N/A'}</p>
          <h3>Genres:</h3>
          <ul>
            {movieDetails.genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
          <p>Runtime: {movieDetails.runtime ? `${movieDetails.runtime} minutes` : 'N/A'}</p>
          <h3>Production Companies:</h3>
          <ul>
            {movieDetails.production_companies.map((company) => (
              <li key={company.id}>{company.name}</li>
            ))}
          </ul>
          <div className="button-container">
          <button className="add-to-favorites-btn" onClick={handleAddToFavorites}>Add to My Watchlist</button>
            <Link to="/" className="go-back-btn">Go Back</Link>
          </div>
        </div>
      ) : (
        <p className="error-message">No movie details found.</p>
      )}
    </div>
  );
};

export default Home;
