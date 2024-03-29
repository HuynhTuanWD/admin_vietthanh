import React, { Component, useState, useEffect } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "elements/CustomButton/CustomButton.jsx";
import Loader from "react-loader";
import { useInput } from "../../hooks/input-hook";
import axios from "axios";
import { useStateValue } from "state";
import store from "store";
import { withRouter } from "react-router-dom";
export default withRouter(function LoginPage(props) {
  const { history } = props;
  const [cardHidden, setCardHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [, dispatch] = useStateValue();
  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername
  } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword
  } = useInput("");
  useEffect(() => {
    let timeout = setTimeout(
      function() {
        setCardHidden(false);
      }.bind(this),
      700
    );
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    setIsError(false);
    return () => setIsError(false);
  }, [username, password]);
  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res = await axios.post("/user/signIn", { username, password });
      if (res.status === 200) {
        store.set("token", res.data.token);
        dispatch({ type: "LOG_IN", token: res.token });
        history.push("/");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setIsError(true);
          setIsLoading(false);
        }
      } else {
        console.log("API LOGIN ERROR");
      }
    }
  };
  return (
    <Grid>
      <Row>
        <Col md={4} sm={6} mdOffset={4} smOffset={3}>
          <form onSubmit={handleLogin}>
            <Card
              hidden={cardHidden}
              textCenter
              title="Đăng nhập"
              content={
                <div>
                  <Loader loaded={!isLoading}>
                    <FormGroup>
                      <ControlLabel>Tài khoản</ControlLabel>
                      <FormControl
                        {...bindUsername}
                        placeholder="Tài khoản"
                        type="text"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Mật khẩu</ControlLabel>
                      <FormControl
                        {...bindPassword}
                        placeholder="Mật khẩu"
                        type="password"
                      />
                    </FormGroup>
                    {!isError || (
                      <p className="text-danger">Sai tài khoản hoặc mật khẩu</p>
                    )}
                  </Loader>
                </div>
              }
              legend={
                <Button
                  type="submit"
                  disabled={isLoading}
                  bsStyle="info"
                  fill
                  wd
                >
                  Đăng nhập
                </Button>
              }
              ftTextCenter
            />
          </form>
        </Col>
      </Row>
    </Grid>
  );
});
