import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import indexRoutes from "./routes/index.jsx";
import { StateProvider, useStateValue } from "./state";
import registerServiceWorker from "./registerServiceWorker";

import "./assets/css/bootstrap.min.css";
import "./assets/sass/light-bootstrap-dashboard.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import axios from "axios";
import { deepStrictEqual } from "assert";

axios.defaults.baseURL = 'http://localhost:3000';

const App = () => {
  const initialState = {
    app: {
      token: "",
      isLogin: sessionStorage.getItem("token") ? true : false
    },
    profile: {}
  };
  const appReducer = (app, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...app,
          isLogin: true,
          token: action.token
        };
      case "LOG_OUT":
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

const Test = () => {
  const handleChangeImage = e => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };
  const [file, setFile] = useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    let fd = new FormData();
    fd.append("avatar", file);
    let data = {
      name: "123"
    };
    let res = await axios.post(
      "http://localhost:3000/api/user/uploadAvatar",
      fd
    );
    console.log(res.data);
  };
  return <App />;
};
ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
