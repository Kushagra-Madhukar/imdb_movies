import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { BACKEND_URL } from "../config";
import Spinner, { StyledSpinner } from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../user.context";

export const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV-Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];
const MovieCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  // grid-template-rows: repeat(auto-fit, minmax(300px, 400px));
  justify-items: center;
  // align-items: center;
  column-gap: 3em;
  row-gap: 3em;
  padding: 3em;
  @media screen and (max-width: 400px) {
    padding: 1em;
  }
  div {
    grid-row: span 1;
    grid-column: span 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin: 0;
    box-shadow: 1px 1px 4px #c0c0c0;
    border-radius: 4px;
    max-height: 350px;
    min-height: 300px;
    background-color: #96351e;
    &:hover {
      box-shadow: 2px 2px 20px 7px #c0c0c0;
      cursor: pointer;
    }
    img {
      display: block;
      width: 100%;
      height: calc(100% - 4rem);
      border-radius: inherit;
      object-fit: cover;
      flex: 1;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const Home = () => {
  const userDetails = useContext(UserContext);
  let navigate = useNavigate();
  const [item, setItem] = useState({ Movies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [year, setYear] = useState("");
  const [sort, setSort] = useState({ by: "popularity", order: "desc" });
  const [genre, setGenre] = useState("");
  const selectElPop = useRef(null);
  const buttonRef = useRef();

  const fetchMovies = async (endpoint) => {
    setError(false);
    setLoading(true);

    const isLoadMore = endpoint.search("page");
    // console.log(endpoint);
    try {
      const result = await (await fetch(endpoint)).json();
      // console.log(result);
      if (result.success) {
        setItem((prev) => ({
          ...prev,
          Movies:
            isLoadMore !== -1
              ? [...prev.Movies, ...result.msg]
              : [...result.msg],
          CurrentPage: result.page,
          lastPage: result.lastPage,
        }));
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  const handleScroll = (e) => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;

    const body = document.body;
    const html = document.documentElement;

    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight
    );

    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight - 1) {
      buttonRef.current && buttonRef.current.click();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const makeItSort = (event) => {
    const sortVal = event.target.value.split(".");
    setSort({ by: sortVal[0], order: sortVal[1] });
    setLoading(false);
  };

  const handleGenre = (event) => {
    setGenre(event.target.value);
    setLoading(false);
  };

  const clearFilters = () => {
    selectElPop.current.value = "popularity.desc";
    setYear("");
    setGenre("");
    setSort({ by: "popularity", order: "desc" });
    setLoading(false);
  };

  useEffect(() => {
    const queryString = `${BACKEND_URL}/movies/search?sort_by=${sort.by}&sort_order=${sort.order}&genre=${genre}&name=${searchTerm}`;
    fetchMovies(queryString);
  }, [sort.by, sort.order, genre]);

  const [searchTerm, setSearchTerm] = useState("");
  function searchMovies() {
    clearFilters();
    const queryString = `${BACKEND_URL}/movies/search?sort_by=${sort.by}&sort_order=${sort.order}&name=${searchTerm}`;
    fetchMovies(queryString);
  }

  function loadMore() {
    if (!item.lastPage) {
      let queryString = `${BACKEND_URL}/movies/search?sort_by=${sort.by}&sort_order=${sort.order}&genre=${genre}&name=${searchTerm}`;
      if (item.CurrentPage) queryString += `&page=${item.CurrentPage}`;
      fetchMovies(queryString);
    }
  }
  async function deleteMovie(mid) {
    try {
      const deletedMovie = await axios
        .post(
          `${BACKEND_URL}/movies/delete`,
          { mid },
          { withCredentials: true }
        )
        .then((res) => res.data);
      fetchMovies(
        `${BACKEND_URL}/movies/search?sort_by=${sort.by}&sort_order=${sort.order}&name=${searchTerm}`
      );
    } catch (err) {
      console.log(err);
    }
  }

  const sortTypes = [
    { by: "popularity", order: "asc" },
    { by: "popularity", order: "desc" },

    { by: "directorname", order: "asc" },
    { by: "directorname", order: "desc" },

    { by: "moviename", order: "asc" },
    { by: "moviename", order: "desc" },
  ];
  return !userDetails.msgReceivedFromBackend ? (
    <StyledSpinner />
  ) : (
    <div>
      <input
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <button onClick={searchMovies}>Search</button>
      <br />
      <div style={{ textAlign: "center" }}>
        {genres.map((genre) => (
          <button
            key={genre.name}
            onClick={(e) => {
              handleGenre(e);
            }}
            value={genre.name}
            style={{
              borderColor: "#19ba90",
              textAlign: "center",
              fontSize: "0.9em",
              margin: "1px",
            }}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <br />
      <select
        value={`${sort.by}.${sort.order}`}
        onChange={makeItSort}
        ref={selectElPop}
      >
        {sortTypes.map((s) => (
          <option
            key={`${s.by}.${s.order}`}
            value={`${s.by}.${s.order}`}
          >{`${s.by} ${s.order}`}</option>
        ))}
      </select>
      <button onClick={clearFilters}>Clear Filters</button>
      <MovieCardContainer>
        {userDetails.isAdmin && (
          <div
            style={{ display: "flex" }}
            onClick={() => navigate(`/movies/new`)}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/000/567/102/large_2x/additional-plus-icon-vector.jpg"
              alt={`plus`}
            />
            {/* <p>{mv.name}</p> */}
          </div>
        )}
        {item.Movies.length !== 0
          ? item.Movies.map((mv, i) => (
              <div
                key={mv._id}
                style={{ display: "flex", position: "relative" }}
                onClick={() => navigate(`/movies/${mv._id}`)}
              >
                <img
                  src="https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/b1/bb/23/b1bb23b0-5941-249a-5ae6-72b07e539dfa/AppIcon-0-1x_U007emarketing-0-6-0-85-220.png/1200x630wa.png"
                  alt={`${mv.name}`}
                />
                <p><b>Movie:</b> {mv.name}</p>
                <p><b>Director:</b> {mv.director}</p>
                <p><b>Rating:</b> {mv.imdb_score}</p>
                {userDetails.isAdmin && (
                  <button
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      cursor: "pointer",
                      zIndex: 100,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMovie(mv._id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          : null}
      </MovieCardContainer>
      {loading && <Spinner />}
      {/* <DisplayRegion movies={movies} /> */}
      <br />
      {!item.lastPage && (
        <button ref={buttonRef} onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Home;
