import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom';
import store from "../../store";
import Sidebar from "../Sidebar";
import Main from "../Main/Main";

import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Router>
          <Routes>
            <Route path="/" element={
              <>
                <Sidebar />
                <Main />
              </>
            } />
            <Route path="/user" element={<div>User Info</div>} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
