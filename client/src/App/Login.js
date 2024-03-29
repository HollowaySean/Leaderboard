import React, { useRef } from 'react'
import '../Styles/panel.css'

export default function Login(props) {

  // Set refs
  const usernameRef = useRef([]);
  const passwordRef = useRef([]);
  const messageRef = useRef([]);
  const rememberRef = useRef([]);

  // Callback to create new user
  function handleCreateUser(e) {

    // Save input form values
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    // Clear input fields
    // usernameRef.current.value = '';
    // passwordRef.current.value = '';

    // Make sure username is not blank
    if(username === '') { return; }
    
    // Post request with fetch
    fetch(props.API_ROUTE + '/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: username,
        password: password
      })
    }).then((res) => {

      // Handle HTTP status codes
      switch(res.status) {
        case 201:
          messageRef.current.innerHTML = 'New user \'' + username + '\' created.';
          handleLogin();
          break;
        case 409:
          messageRef.current.innerHTML = 'Username already exists.';
          break;
        default:
          console.log('Unknown HTTP response: ' + res.status);
      }
    })
    .catch((error) => {

      // Catch HTTP errors
      messageRef.current.innerHTML = 'Error creating new user.';
    });
  }

  // Callback to validate user login
  function handleLogin(e) {

    // Save input form values
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    // Make sure username is not blank
    if(username === '') { return; }

    // Post request with fetch
    fetch(props.API_ROUTE + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: username,
        password: password
      })
    }).then(res => {

      // Handle HTTP status code
      switch(res.status) {
        case 200:
          messageRef.current.innerHTML = 'Success, logging in...';
          res.json().then((userID) => props.loginCallback(userID.userID, rememberRef.current.checked));  
          break;
        case 400:
          messageRef.current.innerHTML = 'Username not found.';
          break;
        case 401:
          messageRef.current.innerHTML = 'Incorrect password.';
          break;
        default:
          console.log('Unknown HTTP response: ' + res.status);
      }
    }).catch(error => {

      // Catch HTTP errors
      messageRef.current.innerHTML = 'Error validating user credentials.';
    });
  }

  // JSX return
  return (
    <div className="panel">
      <h1>Login</h1>
      <div className="panel-body">
        <form>
          <label htmlFor="username">Username</label>
          <input ref={usernameRef} type="text" name="username" autoComplete="username"/>
          <label htmlFor="password">Password</label>
          <input ref={passwordRef} type="password" name="password" autoComplete="current-password"></input>
        </form>
        <div className="rememberMe">
          <input type="checkbox" ref={rememberRef} name="rememberMe"/>
          <label htmlFor="rememberMe">Stay logged in </label>
        </div>
        <div className="loginButtons">
          <button onClick={handleLogin}>Log in</button>
          <button onClick={handleCreateUser}>Sign up</button>
        </div>
        <p ref={messageRef}></p>
      </div>
    </div>
  )
}