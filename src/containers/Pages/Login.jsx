import LoginPage from 'views/Pages/LoginPage.jsx';
import React, { Component } from "react";
import { Switch, Route,Redirect } from "react-router-dom";

import Footer from "components/Footer/Footer.jsx";
import PagesHeader from "components/Header/PagesHeader.jsx";
// dinamically create pages routes

import bgImage from "assets/img/full-screen-image-3.jpg";

class Pages extends Component {
  getPageClass() {
    var pageClass = "";
    switch (this.props.location.pathname) {
      case "/pages/login-page":
        pageClass = " login-page";
        break;
      case "/pages/register-page":
        pageClass = " register-page";
        break;
      case "/pages/lock-screen-page":
        pageClass = " lock-page";
        break;
      default:
        pageClass = "";
        break;
    }
    return pageClass;
  }
  componentWillMount() {
    if (document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }
    console.log('cwm login');
  }
  render() {
    return (
      <div>
        {/* <PagesHeader /> */}
        <div className="wrapper wrapper-full-page">
          <div
            className={"full-page" + this.getPageClass()}
            data-color="black"
            data-image={bgImage}
          >
            <div className="content">
              <Switch>
                <Route path="/pages/login-page" component={LoginPage} />
                <Redirect to="/pages/login-page" />
              </Switch>
            </div>
            {/* <Footer transparent /> */}
            <div
              className="full-page-background"
              style={{ backgroundImage: "url(" + bgImage + ")" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Pages;
