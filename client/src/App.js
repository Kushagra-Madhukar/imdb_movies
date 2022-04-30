import './App.css';
import {Routes, Route} from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react';
import Home from './pages/Home';
import NewMovie from './pages/NewMovie';
import MoviePage from './pages/MoviePage';
import { UserContext, UserDispatchContext } from './user.context';
import axios from 'axios';
import { BACKEND_URL } from './config';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const setUserDetails = useContext(UserDispatchContext)
    const userDetails = useContext(UserContext)
    // const [error, setError] = useState(false)
    // const [showError, setShowError] = useState({head: 'Account Notification', err: ''})
    useEffect(() => {
        const axiosCancel = axios.CancelToken.source()
        axios.get(`${BACKEND_URL}/users/profile`, {withCredentials: true})
            .then(res => {
                const data = res.data
                if(data.success){
                  const profile = data.profile
                  // console.log(profile, 'profile')
                  setUserDetails({username: profile?.username, isAdmin: profile?.isAdmin, msgReceivedFromBackend: true, email: profile?.email, connectionErr: false})
                  if(data.showAlert){
                    alert(data.alertMsg)
                  }
                }
                else {
                  console.log(data.msg)
                  setUserDetails(userDetails => ({...userDetails, isAdmin: false, msgReceivedFromBackend: true, connectionErr: false}))
                }
            })
            .catch(err => {
              console.log('Error', err)
              setUserDetails(userDetails => ({...userDetails,msgReceivedFromBackend: true, connectionErr: true}))
            })
        return () => {
          axiosCancel.cancel()
        }
    }, [setUserDetails])
  return (
    <React.Fragment>
      <Header />
      <Routes>
      <Route exact path="/" element={<Home />}/>
        {/* <Route index element={<Home />} /> */}
        <Route exact path="movies" element={<MoviePage />}/>
          <Route exact path="movies/new" element={<NewMovie />} />
          <Route path="movies/:movieId" element={<MoviePage />} />
        {/* </Route> */}
        
      <Route exact path="/login" element={<Login/>} />
      <Route exact path="/register" element={<Register/>} />
      {/* </Route> */}
      </Routes>
      {/* <Footer /> */}
    </React.Fragment>
  );
}

export default App;
