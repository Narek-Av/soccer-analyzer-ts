import { Provider } from "react-redux";
import store from "../../store";
import Sidebar from "../Sidebar";
import Main from "../Main";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Sidebar />
        <Main />
      </div>
    </Provider>
  );
}

export default App;
