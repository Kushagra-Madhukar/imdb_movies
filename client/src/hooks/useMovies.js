import { useState, useEffect, useRef } from 'react'
import { BACKEND_URL } from '../config'

const date = new Date();

function convertDate(date) {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString();
  const dd = date.getDate().toString();

  const mmChars = mm.split('');
  const ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

//custom hook
export const useMovies = () => {
  const [item, setItem] = useState({ Movies: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [year, setYear] = useState('')
  const [sort, setSort] = useState('popularity.desc')
  const [rating, setRating] = useState({ min: 0, max: 10 });
  const [yearRange, setYearRange] = useState({ min: 1980, max: 2020 });
  const [genre, setGenre] = useState('');
  const selectElPop = useRef(null);

  const fetchMovies = async endpoint => {
    setError(false)
    setLoading(true)

    const isLoadMore = endpoint.search('page')
    try {
      const result = await (await fetch(endpoint)).json()

      setItem(prev => ({
        ...prev,
        Movies:
          isLoadMore !== -1
            ? [...prev.Movies, ...result.results]
            : [...result.results],
        CurrentPage: result.page,
        totalPages: result.total_pages,
      }))
    } catch (error) {
      setError(true)
    }
    setLoading(false)
  }

  const makeItSort = (event) => {
    setSort(event.target.value)
    setLoading(false);
  }


  const handleGenre = (event) => {
    setGenre(event.target.value);
    setLoading(false);
  };

  const clearFilters = () => {
    // selectEl.current.value = '';
    selectElPop.current.value = 'popularity.desc';
    setYear('')
    setGenre('')
    setRating({ min: 0, max: 10 })
    setYearRange({ min: 1980, max: 2020 })
    setSort('popularity.desc')
    setLoading(false);
  }

  useEffect(() => {
    // const CurrentLanguage = localStorage.getItem('language');
    fetchMovies(`${BACKEND_URL}discover/movie?sort_by=${sort}&with_genres=${genre}`)
// eslint-disable-next-line 
  }, [sort.by, sort.order, rating.min, rating.max, genre])

  return [{ item, loading, error, year, sort, rating, yearRange, genre, selectElPop }, fetchMovies, makeItSort, handleGenre, clearFilters]
}