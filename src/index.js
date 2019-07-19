import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.jsx";
import { StateProvider, useStateValue } from "./state";
import registerServiceWorker from "./registerServiceWorker";

import "./assets/css/bootstrap.min.css";
import "./assets/sass/light-bootstrap-dashboard.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "./assets/css/style.css";
import axios from "axios";
import store from "store";
import mainReducer from "./reducers"
dotenv.config();
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["Authorization"] = store.get("token");
// axios.defaults.proxy = "http://localhost:3000";
const AppWithReducer = () => {
  const initialState = {
    user:{
      avatar:"",
      name:"",
      username:"",
      role:1
    }
  };
  return (
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <BrowserRouter>
        <Switch>
          {indexRoutes.map((prop, key) => {
            return (
              <Route path={prop.path} component={prop.component} key={key} />
            );
          })}
        </Switch>
      </BrowserRouter>
    </StateProvider>
  );
};

const App = () => {
  return (
    <AppWithReducer/>
  )
}
ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
