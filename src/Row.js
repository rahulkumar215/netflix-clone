import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //a snipper of code which runs bases on a specific conditon/variable

  useEffect(() => {
    //if [] is empty, it tell useeffect, run once when the row loads, and dont run again
    //asynu cannot be used inside of useeffect but with this trick below like calling the function after defining it you can make it async
    //the await keyword tells the fetchdata() method to wait for the response of the request even if it takes 5 sec. or more
    async function fetchDate() {
      const request = await axios.get(fetchUrl);

      // the above funcitn axios.get(fetchUrl) is going to first fetch the baseUrl from axios.js then its going to append the custom urls from reuests.js like this
      // https://api.themoviedb.org/3 + /discover/tv?api_key=${APIKEY}&with_networks=213 which becomes => https://api.themoviedb.org/3/discover/tv?api_key=${APIKEY}&with_networks=213

      //this is all possible becouse of the axios npm packed wow nicee..

      setMovies(request.data.results);
      return request;
    }
    fetchDate();

    // one important thing to note here is whatever variable or element is being pulled inside (declared outside of mthod but being used inside useEffect )the useEffect method, you have to mention it in the 2nd argument of of useEffect which is array like [fectchUrl] one, the reason being is that the useEffect funciton is dependent on the fetchUrl because everytime the fecthUrl changes we have to update the useeffect method so that it can make request accordingly to the updated value.
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) { 
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.name || movie?.original_name || movie?.title || "")
        .then((url) => { 
          const urlParams = new URLSearchParams(new URL(url).search);

          setTrailerUrl(urlParams.get('v'));

        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      {/* title */}

      <h2>{title}</h2>

      <div className="row_posters">
        {/* several row poster */}
        {movies.map((movie) => {
          return (
            <img
              className={`row_poster ${isLargeRow && "row_largePoster"}`}
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              } `}
              alt={movie.name}
              key={movie.id}
              onClick={()=> handleClick(movie)}
            />
          );
        })}
      </div>
 
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

      {/* container -> posters */}
    </div>
  );
}

export default Row;
