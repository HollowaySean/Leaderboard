import React from 'react'

export default function Login() {
  return (
    <>
    <label for="username">Username</label>
    <input type="text" name="username"/>
    <br />
    <label for="password">Password</label>
    <input type="password" name="password"></input>
    <br />
    <button>Log in</button>
    <button>Sign up</button>
    </>
  )
}
