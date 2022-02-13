import React, { FunctionComponent } from 'react';
import Login from '../Login';

import './User.css';

const User: FunctionComponent = () => {
  return (
    <div className="user-component">
      <div className="user-component-header">
        <span>logo</span>
        <button>Login</button>
      </div>
      <Login />
    </div>
  )
}

export default User;