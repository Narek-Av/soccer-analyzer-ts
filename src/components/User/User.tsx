import React, { FunctionComponent } from 'react';
import Login from '../Login';
import Register from '../Register';

import './User.css';

const User: FunctionComponent = () => {
  const isAuthenticated = true;

  return (
    <div className="user-component">
      <div className="user-component-header">
        <span>logo</span>
        <button>Login</button>
      </div>

      {isAuthenticated ? <Login /> : <Register />}
    </div>
  )
}

export default User;