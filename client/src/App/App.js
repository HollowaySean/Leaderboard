import React, { useState, useEffect } from 'react';
import Login from './Login';
import GroupList from './GroupList';
import GroupInfo from './GroupInfo';

// Flag to avoid infinite loop
let checkedLogin = false;

function App(props) {

  // State hooks
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [groupID, setGroupID] = useState(null);

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

  // Callback function for logging out
  function logoutCallback() {

    // Set state variables
    setLoggedIn(false);
    setGroupID(null);
    setUserID(null);

    // Remove from local storage
    localStorage.removeItem('userID');

  }

  // JSX return
  if(isLoggedIn) {
    return (
    <div className="panel-container">
      <GroupList 
        API_ROUTE={props.API_ROUTE} 
        userID={userID}
        groupIDCallback={setGroupID}
        logoutCallback={logoutCallback}
      />
      <GroupInfo
        API_ROUTE={props.API_ROUTE}
        groupID={groupID}
        userID={userID}
      />
    </div>
    )

  }else{
    return ( 
    <div className="panel-container">
      <Login 
        API_ROUTE={props.API_ROUTE} 
        loginCallback={loginComplete}
      />
    </div>
    )
  }
}

export default App;