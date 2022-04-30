import React, {useState, useContext} from 'react'
import axios from 'axios'
import {useNavigate, useParams, Navigate} from 'react-router-dom'
import styled from 'styled-components'
import { BACKEND_URL } from '../config'
import Multiselect from 'multiselect-react-dropdown';
import { genres } from '../pages/Home'
import { UserContext } from '../user.context'
import StyledSpinner from './Spinner'

export const SignBackground = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`
export const SignHead = styled.h2`
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 32px;
    margin-top: 20px;
`
export const SignTopContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`
export const SignContainer = styled.div`
    padding: 32px; 
    border-radius: 8px;
    box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.25);
    width: 100%;
`
export const SignHolder = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const SignInputField = styled.input`
    color: rgba(19, 20, 21, 1);
    border: 1px solid #c8c8c8;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
    line-height: 19px;
    height: 28px;
    outline: none;
`
export const SignSubmitButton = styled.button`
    border: 0.1px solid rgba(45, 45, 45, 1);
    height: 45px;
    font-weight: 500;
    outline: none;
    font-size: 16px;
    /* margin-bottom: 12px; */
    color: #fff;
    background-color: #2d2d2d;
    font-size: 14px;
    border: none;
    outline: none;
    border-radius: 5px;
    height: 45px;
    &:hover{
        opacity: 80%;
    }
    &:focus{
        background-color: #1a1d1f;
    }
`
export const ErrorField = styled.span`
    font-size: 0.7rem;
    color: red;
    height: 1.8em;
`
export const SignWholeContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 416px;
    margin: 2em 0;
    @media (max-width: 420px){
        width: 95%;
    }
`
// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

const MovieForm = ({edit = false, data}) => {
    const navigate = useNavigate()
    const {movieid} = useParams();
    const userDetails = useContext(UserContext)
    const [formData, setFormData] = useState(data ? {
        name: data.name,
        rating: data.imdb_score,
        director: data.director,
        genre: data.genre
    } : {
        name: '',
        rating: '',
        director: '',
        genre: ''
      })
    const [errors, setErrors] = useState({
        name: '',
        rating: '',
        director: '',
        genre: '',
        general: ''
      })

    async function submitHandler(e){
        e.preventDefault()
        // console.log(e.target.value, formData)
        if(!edit) {
            try {
                let movieRes = await axios.post(`${BACKEND_URL}/movies/add`, formData, {withCredentials: true}).then(res => res.data)
                if(movieRes.success) {
                    alert('Movie Added');
                    setFormData({
                        name: '',
                        rating: '',
                        director: '',
                        genre: ''
                    })
                } else {
                    const {msg} = movieRes
                    setErrors({name: msg?.name, rating: msg?.rating, director: msg?.director, genre: msg?.genre})
                }
            } catch(err) {
                setErrors(e => ({...e, general: err}));
            }
        } else {
            try {
                let movieRes = await axios.post(`${BACKEND_URL}/movies/edit`, {...formData, id: movieid}, {withCredentials: true}).then(res => res.data)
                if(movieRes.success) {
                    alert('Movie Updated');
                } else {
                    const {msg} = movieRes
                    setErrors({name: msg?.name, rating: msg?.rating, director: msg?.director, genre: msg?.genre})
                }
            } catch(err) {
                setErrors(e => ({...e, general: err}));
            }
        }
    }
    const multiSelectAdd = v => {
        console.log(v, 'value')
        setFormData(f => ({...f, genre: v}))
    }
    const multiSelectRemove = v => {
        console.log(v, 'value')
        setFormData(f => ({...f, genre: v}))
    }
    return !userDetails.msgReceivedFromBackend ? <StyledSpinner /> : !userDetails.isAdmin ? <Navigate to='/' /> : (
        <SignBackground>
            <SignWholeContainer>
                <SignTopContainer>
                    <SignHead>{edit ? 'Edit Movie' : 'Add Movie'}</SignHead>
                </SignTopContainer>
                <SignContainer>
                    <SignHolder onSubmit={submitHandler}>
                        <label>Movie Name</label>
                        {!edit ? <SignInputField type="text" name="moviename" value={formData?.name} onChange={(e) => setFormData(f => ({...f, name: e.target.value}))} required disabled={edit}/> :
                        <SignInputField value={formData?.name} disabled={edit}/>}
                        <ErrorField>{errors?.name}</ErrorField>
                        <label>Director Name</label>
                        <SignInputField type="text" name="directorname" value={formData?.director} onChange={(e) => setFormData(f => ({...f, director: e.target.value}))} required/>
                        <ErrorField>{errors?.director}</ErrorField>
                        <label>Rating</label>
                        <SignInputField min={0} max={10} type="number" name="rating" step={0.1} value={formData?.rating} onChange={(e) => setFormData(f => ({...f, rating: e.target.value}))} required/>
                        <ErrorField>{errors?.rating}</ErrorField>
                        <label>Genres</label>
                        <Multiselect
                            options={genres} // Options to display in the dropdown
                            selectedValues={formData.genre ? formData.genre : []} // Preselected value to persist in dropdown
                            onSelect={(v) => multiSelectAdd(v)} // Function will trigger on select event
                            onRemove={(v) => multiSelectRemove(v)} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />
                        <ErrorField>{errors?.genre}</ErrorField>
                        <SignSubmitButton type="submit">{edit ? 'Edit' : 'Add'}</SignSubmitButton>
                    </SignHolder>
                </SignContainer>
            </SignWholeContainer>
        </SignBackground>
    )
}

export default MovieForm
