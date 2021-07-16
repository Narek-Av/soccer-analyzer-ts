import React from "react";
import { Provider } from "react-redux";
import store from "../../store";
import Sidebar from "../Sidebar";
import Main from "../Main/Main";

import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Sidebar />
        <Main />
      </div>
    </Provider>
  );
};

export default App;
