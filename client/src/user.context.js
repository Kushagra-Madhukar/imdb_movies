import React, { createContext, useState } from "react";
import axios from 'axios'
import { BACKEND_URL } from "./config";

const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);
const UserLogoutContext = createContext()

function UserProvider({ children }) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    isAdmin: false,
    msgReceivedFromBackend: false,
    connectionErr: false
  });

  async function logoutHandler(){
    try{
    let logoutRes = await axios.get(`${BACKEND_URL}/login/logout`, {withCredentials: true})
    if(logoutRes.data.success)
    setUserDetails({username: '',isAdmin: false, msgReceivedFromBackend: true, connectionErr: false})
    // console.log(logoutRes)
    } catch(err) {
        console.log(err)
    }
  }

  return (
    <UserContext.Provider value={userDetails}>
      <UserDispatchContext.Provider value={setUserDetails}>
        <UserLogoutContext.Provider value={logoutHandler}>
        {children}
        </UserLogoutContext.Provider>
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext, UserDispatchContext, UserLogoutContext };