import React, { useRef } from 'react'

const API_ROUTE = 'http://192.168.3.202:8081';

export default function Login() {

  const usernameRef = useRef([]);
  const passwordRef = useRef([]);

  // Callback to create new user
  function handleCreateUser(e) {

    // Save input form values
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    
    // Post request with fetch
    fetch(API_ROUTE + '/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: username,
        password: password
      })
    }).then((res) => res.text())
    .then((text) => console.log(text))
    .catch(error => console.log('Error creating new user'));
  }

  // Callback to validate user login
  function handleLogin(e) {

    // Save input form values
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    // Post request with fetch
    fetch(API_ROUTE + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: username,
        password: password
      })
    }).then(res => {
      switch(res.status) {
        case 200:
          res.json().then((userID) => console.log(userID));
          break;
        case 401:
          console.log('Incorrect password');
          break;
        default:
          console.log('Unknown HTTP response: ' + res.status);
      }
    }).catch(error => console.log('Error validating password'));
  }

  return (
    <>
    <form>
      <label htmlFor="username">Username</label>
      <input ref={usernameRef} type="text" name="username"/>
      <br />
      <label htmlFor="password">Password</label>
      <input ref={passwordRef} type="password" name="password"></input>
    </form>
    <br />
    <button onClick={handleLogin}>Log in</button>
    <button onClick={handleCreateUser}>Sign up</button>
    </>
  )
}