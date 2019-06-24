import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

import indexRoutes from "./routes/index.jsx";

import registerServiceWorker from "./registerServiceWorker";

import "./assets/css/bootstrap.min.css";
import "./assets/sass/light-bootstrap-dashboard.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import Axios from "axios";
import { deepStrictEqual } from "assert";

const App = () => (
  <HashRouter>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </HashRouter>
);
const Test = () => {
  const handleChangeImage = e => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };
  const [file,setFile] = useState('');
  const handleSubmit = async e =>{
    e.preventDefault();
    let fd = new FormData();
    fd.append('avatar',file);
    let data = {
      name:'123'
    }
    let res = await Axios.post("http://localhost:3000/api/user/uploadAvatar",{fd,data});
    console.log(res.data);
  }
  return (
    <form onSubmit={handleSubmit} id="uploadfile">
      <input type="file" onChange={handleChangeImage} name="avatar" />
      <input type="submit" value="Upload a file" />
    </form>
  );
};
ReactDOM.render(<Test />, document.getElementById("root"));
registerServiceWorker();
