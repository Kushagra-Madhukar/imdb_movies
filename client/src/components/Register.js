import React, {useContext, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ErrorField, SignBackground, SignContainer, SignHead, SignHolder, SignInputField, SignSubmitButton, SignTopContainer, SignWholeContainer } from './MovieForm'
import {UserDispatchContext} from '../user.context';
import axios from 'axios'
import { BACKEND_URL } from '../config';
import styled from 'styled-components'


const OtherPageLink = styled.div`
    font-size: 12px;
    color: #6E7491;
    text-align: center;
    margin: 0 3em;
    height: 46px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    > span{
        color: blue;
        cursor: pointer;
    }
`
const OtherPageText = styled.div`
    color: #5C5B5B;
    font-size: 14px;
    margin-bottom: 0.6em;
`
const PageLink = styled(Link)`
&&{
    color: #017AFF;
    font-size: 1rem;
    cursor: pointer;
}
`
const SignBottomContainer = styled(SignTopContainer)`
    align-items: center;
    margin-top: 32px;
`

const Register = () => {
    // const {user} = useSelector(state => state.user)
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [errors, setErrors] = useState({username: '', password: ''})
    const navigate = useNavigate()
    const setUserDetails = useContext(UserDispatchContext)

    async function submitHandler(e){
        e.preventDefault()
        try{
            let loginResponse = await axios.post(`${BACKEND_URL}/login/register`, {username: username, password: password}, {withCredentials: true})
            if(loginResponse.status === 200 && loginResponse.data.success){
                const profile = loginResponse.data.msg
                setUserDetails({username: profile.username, email: profile.email, isAdmin: profile.isAdmin, msgReceivedFromBackend: true, connectionErr: false})
                navigate('/')
            } else{
                const msg = loginResponse.data.msg
               console.log(msg)
               setErrors({username: msg.username, password: msg.password})
            }
        } catch(err){
            console.log(err)
            setUserDetails(userDetails => ({...userDetails, connectionErr: true}))
        }
    }
  return (
    <SignBackground>
            <SignWholeContainer>
                <SignTopContainer>
                    <SignHead>Register</SignHead>
                </SignTopContainer>
                <SignContainer>
                    <SignHolder onSubmit={submitHandler}>
                        <SignInputField type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required/>
                        <ErrorField>{errors.username}</ErrorField>
                        <SignInputField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
                        <ErrorField>{errors.password}</ErrorField>
                        <SignSubmitButton type="submit">Register</SignSubmitButton>
                    </SignHolder>
                </SignContainer>
                <SignBottomContainer>
                    <OtherPageLink>
                        <OtherPageText>Have an account?</OtherPageText>
                        <PageLink to='/login'>Login</PageLink>
                    </OtherPageLink>
                </SignBottomContainer>
            </SignWholeContainer>
        </SignBackground>
  )
}

export default Register