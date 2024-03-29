import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Dash from "../Dash/Dash";
// dinamically create app routes
import Login from "../Pages/Login";
import { StateContext } from "../../state";
class App extends Component {
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.action === "PUSH" &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }
  static contextType = StateContext;
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Dash} />
      </Switch>
    );
  }
}

export default App;
