import React, { useState, useEffect } from 'react';
import { LinearProgress } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import SignInSide from './components/login';
import Dashboard from './components/home/dashboard';
import axios from 'axios';
import config from './config';

export default function Home() {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['session']);

  useEffect(() => {
    let session = cookies.session;

    if (!session ){
      setIsAuth(false);
      setIsLoadingPage(false);
      return;
    }
    axios({
      url: config.serverUrl,
      method: "GET",
      params: {
        function: "checklogin",
        session: session
      }
    })
    .then(response => {
      if(!response.data.login) throw new Error("Session wrong or expired");

      setIsLoadingPage(false);
      setIsAuth(true);
    })
    .catch(error => {
      const { response } = error;
      if (response) {
        const { request, ...errorObject } = response;
        console.log(errorObject);
      }
      setIsLoadingPage(false);
      setIsAuth(false);
    })
  }, []);

  return (
    !isLoadingPage ?
    (
      !isAuth ?  
      <SignInSide setIsAuth={setIsAuth} setCookie={setCookie} /> :
      <Dashboard setIsAuth={setIsAuth} setCookie={setCookie} />  
    ) :
    (
      <LinearProgress />
    )   
  )
}