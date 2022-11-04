import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';


function Login(props) {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);

    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const wrapperStyle = {
    padding: '20px',
    width: '30%',
    backgroundColor: 'white',
  };
  const titleStyle = {
    fontSize: '24px',
    fontWeight: '300',
  };
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
  };
  const inputStyle = {
    flex: '1',
    minWidth: '40%',
    margin: '10px 0px',
    padding: '10px',
  };
  const pStyle = {
    fontSize: '12px',
    margin: '20px 10px 0px 0px',
    padding: '10px',
  };
  const buttonStyle = {
    width: '40%',
    border: 'none',
    padding: '15px 20px',
    backgroundColor: 'teal',
    color: 'white',
    cursor: 'pointer',
    marginBottom: '10px',
  };
  const linkStyle = {
    fontSize: '12px',
    margin: '5x 0px',
  };

  return (
    <div classname="container" style={containerStyle}>
      <div classname="wrapper" style={wrapperStyle}>
        <div className="title" style={titleStyle}>
          SIGN IN
        </div>
        <form style={formStyle} onSubmit={handleFormSubmit}>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            placeholder="******"
            name="password"
            type="password"
            onChange={handleChange}
            style={inputStyle}
          />
          <button style={buttonStyle}>LOGIN</button>
          <Link style={linkStyle} to="/signup">
            CREATE NEW ACCOUNT
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
