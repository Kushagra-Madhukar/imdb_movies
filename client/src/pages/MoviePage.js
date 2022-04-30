import axios from 'axios'
import React, {useState, useEffect, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MovieForm from '../components/MovieForm'
import StyledSpinner from '../components/Spinner'
import { BACKEND_URL } from '../config'
import { UserContext } from '../user.context'

const MoviePage = () => {
    const userDetails = useContext(UserContext)
    const {movieId} = useParams()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [movieData, setMovieData] = useState()
    useEffect(() => {
        axios.get(`${BACKEND_URL}/movies/getMovie/${movieId}`)
        .then(res => {
            if(res.data.success) {
                setMovieData(res.data.msg)
                setLoading(false)
            }
            else navigate('/')
        })
        .catch(err => {
            if(err) navigate('/')
        })
    }, [])
    
  return loading ? <StyledSpinner/> : (
    <MovieForm data={movieData} edit />
  )
}

export default MoviePage