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
import { deepStrictEqual } from "assert";
import store from "store";
dotenv.config();
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["Authorization"] = store.get("token");
// axios.defaults.proxy = "http://localhost:3000";
const AppWithReducer = () => {
  const initialState = {
    app: {
      token: "",
      isLogin: store.get("token") ? true : false
    },
    profile: {}
  };
  const appReducer = (app, action) => {
    switch (action.type) {
      case "LOG_IN": {
        axios.defaults.headers.common["Authorization"] = store.get("token");
        return {
          ...app,
          isLogin: true,
          token: action.token
        };
      }
      case "LOG_OUT":
        axios.defaults.headers.common["Authorization"] = "";
        return {
          ...app,
          isLogin: false,
          token: ""
        };
    }
  };
  const profileReducer = (profile, action) => {
    switch (action.type) {
    }
  };
  const mainReducer = ({ app, profile }, action) => ({
    app: appReducer(app, action),
    profile: profileReducer(profile, action)
  });
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
