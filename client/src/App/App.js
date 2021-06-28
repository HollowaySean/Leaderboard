import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import GroupList from '../GroupList/GroupList';

// Flag to avoid infinite loop
let checkedLogin = false;

function App(props) {

  // State hooks
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState(null);

  // Wrap in useeffect
  useEffect(() => {

    // Load from session storage
    if("userID" in localStorage && !checkedLogin) {
      let newUserID = parseInt(localStorage.getItem("userID"));
      checkedLogin = true;
      loginComplete(newUserID, true);
    }
  }, []);

  // Callback function for login to update main app
  function loginComplete(newUserID, rememberMe) {

    // Set state variables
    setLoggedIn(true);
    setUserID(newUserID);

    // Save login to session storage
    if(rememberMe) {
      localStorage.setItem('userID', JSON.stringify(newUserID));
    }else if("userID" in localStorage) {
      localStorage.removeItem('userID');
    }
  }

  // JSX return
  if(isLoggedIn) {
    return <GroupList 
      API_ROUTE={props.API_ROUTE} 
      userID={userID}
      />

  }else{
    return <Login 
      API_ROUTE={props.API_ROUTE} 
      loginCallback={loginComplete}
      />
  }
}

export default App;