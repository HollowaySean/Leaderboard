import './Login.css';

function Login() {
  return (
    <div className="center-screen">
      <div className="login-box">
        <label>Username:<br />
          <input type="text" name="username" />
        </label>
        <label>Password:<br />
          <input type="text" name="password" />
        </label>
        <div>
          <input type="submit" value="Submit" />
          <input type="submit" value="Create new" />
        </div>
      </div>
    </div>
  );
}

export default Login;
