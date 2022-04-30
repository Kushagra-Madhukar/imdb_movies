import React, { useContext } from 'react'
import MovieForm from '../components/MovieForm'
import StyledSpinner from '../components/Spinner'
import { UserContext } from '../user.context'

const NewMovie = () => {
  const userDetails = useContext(UserContext)
  return !userDetails.msgReceivedFromBackend ? <StyledSpinner /> : (
    <MovieForm/>
  )
}

export default NewMovie