import React from 'react'

export default function Login() {
  return (
    <>
    <label htmlFor="username">Username</label>
    <input type="text" name="username"/>
    <br />
    <label htmlFor="password">Password</label>
    <input type="password" name="password"></input>
    <br />
    <button onClick={() => FetchTest()}>Log in</button>
    <button>Sign up</button>
    </>
  )
}

function FetchTest() {
  fetch('http://localhost:8081/test')
    .then(res => res.text()
    .then((text) => console.log(text)));
}